package com.mindplates.bugcase.framework.scheduler;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.service.ProjectCachedService;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.HolidayDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunIterationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunListDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunProfileDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunReservationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseUserTestResultDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunIterationService;
import com.mindplates.bugcase.biz.testrun.service.TestrunReservationService;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.HolidayTypeCode;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.code.TestrunIterationTimeTypeCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterSelectRuleCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterTypeCode;
import com.mindplates.bugcase.common.service.MessageChannelService;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalField;
import java.time.temporal.WeekFields;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Random;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@AllArgsConstructor
@ConditionalOnProperty(name = "scheduler.enabled", havingValue = "true", matchIfMissing = true)
public class TestrunScheduler {

    private final TestrunService testrunService;
    private final TestrunReservationService testrunReservationService;
    private final TestrunIterationService testrunIterationService;

    private final SpaceService spaceService;

    private final ProjectService projectService;

    private final ProjectCachedService projectCachedService;

    private final MessageChannelService messageChannelService;

    private final HttpRequestUtil httpRequestUtil;

    private final MessageSourceAccessor messageSourceAccessor;

    private TestrunDTO getTestrun(TestrunReservationDTO testrunReservationDTO, LocalDateTime now) {
        TestrunDTO testrun = TestrunDTO
            .builder()
            .name(testrunReservationDTO.getName())
            .description(testrunReservationDTO.getDescription())
            .project(ProjectDTO.builder().id(testrunReservationDTO.getProject().getId()).build())
            .startDateTime(testrunReservationDTO.getStartDateTime())
            .endDateTime(testrunReservationDTO.getEndDateTime())
            .deadlineClose(testrunReservationDTO.getDeadlineClose())
            .autoTestcaseNotAssignedTester(testrunReservationDTO.getAutoTestcaseNotAssignedTester())
            .addConnectedSequenceTestcase(testrunReservationDTO.getAddConnectedSequenceTestcase())
            .assignSequenceTestcaseSameTester(testrunReservationDTO.getAssignSequenceTestcaseSameTester())
            .build();

        testrun.setHooks(new ArrayList<>());
        testrunReservationDTO.getHooks().forEach((testrunHookDTO -> {
            testrun.getHooks().add(TestrunHookDTO
                .builder()
                .timing(testrunHookDTO.getTiming())
                .name(testrunHookDTO.getName())
                .url(testrunHookDTO.getUrl())
                .method(testrunHookDTO.getMethod())
                .headers(testrunHookDTO.getHeaders())
                .bodies(testrunHookDTO.getBodies())
                .testrun(testrun)
                .retryCount(testrunHookDTO.getRetryCount())
                .build());
        }));

        // testrunIteration의 messageChannels를 testrun의 messageChannels로 변환하여 저장
        testrun.setMessageChannels(new ArrayList<>());
        testrunReservationDTO.getMessageChannels().forEach((testrunMessageChannelDTO -> {
            TestrunMessageChannelDTO testrunMessageChannel = TestrunMessageChannelDTO
                .builder()
                .testrun(testrun)
                .messageChannel(testrunMessageChannelDTO.getMessageChannel())
                .build();
            testrun.getMessageChannels().add(testrunMessageChannel);
        }));

        testrun.setProfiles(new ArrayList<>());

        testrunReservationDTO.getProfiles().forEach((testrunProfileDTO -> {
            testrun.getProfiles()
                .add(TestrunProfileDTO
                    .builder()
                    .profile(SpaceProfileDTO.builder().id(testrunProfileDTO.getProfile().getId()).build())
                    .testrun(testrun)
                    .build());
        }));

        List<TestrunUserDTO> testrunUserList = new ArrayList<>();
        if (testrunReservationDTO.getTestrunUsers() != null) {
            for (TestrunUserDTO testrunUser : testrunReservationDTO.getTestrunUsers()) {
                testrunUserList.add(TestrunUserDTO
                    .builder()
                    .testrun(testrun)
                    .user(UserDTO.builder().id(testrunUser.getUser().getId()).build())
                    .build()
                );
            }
        }
        testrun.setTestrunUsers(testrunUserList);

        Map<Long, ArrayList<Long>> testcaseGroupIdMap = new HashMap<>();

        List<TestrunTestcaseGroupDTO> testcaseGroups = new ArrayList<>();

        if (testrunReservationDTO.getTestcaseGroups() != null) {
            testrunReservationDTO.getTestcaseGroups().forEach((testrunTestcaseGroupDTO -> {
                ArrayList<Long> testcaseIds = new ArrayList<>();
                TestrunTestcaseGroupDTO testcaseGroup = TestrunTestcaseGroupDTO
                    .builder()
                    .testrun(testrun)
                    .testcaseGroup(testrunTestcaseGroupDTO.getTestcaseGroup())
                    .build();

                List<TestrunTestcaseGroupTestcaseDTO> testrunTestcaseGroupTestcaseList = new ArrayList<>();
                for (TestrunTestcaseGroupTestcaseDTO testcase : testrunTestcaseGroupDTO.getTestcases()) {
                    testrunTestcaseGroupTestcaseList.add(TestrunTestcaseGroupTestcaseDTO
                        .builder()
                        .testcase(testcase.getTestcase())
                        .testrunTestcaseGroup(testcaseGroup)
                        .build());
                    testcaseIds.add(testcase.getTestcase().getId());
                }

                testcaseGroup.setTestcases(testrunTestcaseGroupTestcaseList);
                testcaseGroups.add(testcaseGroup);
                testcaseGroupIdMap.put(testcaseGroup.getTestcaseGroup().getId(), testcaseIds);

            }));
        }

        testrunReservationService.selectConditionalTestcaseGroups(testrunReservationDTO, now, testcaseGroups, testcaseGroupIdMap, testrun);
        testrun.setTestcaseGroups(testcaseGroups);

        return testrun;
    }

    private TestrunDTO getTestrun(SpaceDTO spaceDTO, TestrunIterationDTO testrunIterationDTO, LocalDateTime startDateTime, int currentMonth, int currentWeek) {

        TestrunDTO testrun = TestrunDTO
            .builder()
            .name(testrunIterationDTO.getName())
            .description(testrunIterationDTO.getDescription())
            .project(ProjectDTO.builder().id(testrunIterationDTO.getProject().getId()).space(spaceDTO).build())
            .startDateTime(startDateTime)
            .endDateTime(startDateTime.plusHours(testrunIterationDTO.getDurationHours()))
            .deadlineClose(testrunIterationDTO.getDeadlineClose())
            .autoTestcaseNotAssignedTester(testrunIterationDTO.getAutoTestcaseNotAssignedTester())
            .addConnectedSequenceTestcase(testrunIterationDTO.getAddConnectedSequenceTestcase())
            .assignSequenceTestcaseSameTester(testrunIterationDTO.getAssignSequenceTestcaseSameTester())
            .build();

        testrun.setHooks(new ArrayList<>());
        testrunIterationDTO.getHooks().forEach((testrunHookDTO -> {
            testrun.getHooks().add(TestrunHookDTO
                .builder()
                .timing(testrunHookDTO.getTiming())
                .name(testrunHookDTO.getName())
                .url(testrunHookDTO.getUrl())
                .method(testrunHookDTO.getMethod())
                .headers(testrunHookDTO.getHeaders())
                .bodies(testrunHookDTO.getBodies())
                .testrun(testrun)
                .retryCount(testrunHookDTO.getRetryCount())
                .build());
        }));

        // testrunIteration의 messageChannels를 testrun의 messageChannels로 변환하여 저장
        testrun.setMessageChannels(new ArrayList<>());
        testrunIterationDTO.getMessageChannels().forEach((testrunMessageChannelDTO -> {
            TestrunMessageChannelDTO testrunMessageChannel = TestrunMessageChannelDTO
                .builder()
                .testrun(testrun)
                .messageChannel(testrunMessageChannelDTO.getMessageChannel())
                .build();
            testrun.getMessageChannels().add(testrunMessageChannel);
        }));

        testrun.setProfiles(new ArrayList<>());
        testrunIterationDTO.getProfiles().forEach((testrunProfileDTO -> {
            testrun.getProfiles()
                .add(TestrunProfileDTO
                    .builder()
                    .profile(SpaceProfileDTO.builder().id(testrunProfileDTO.getProfile().getId()).build())
                    .testrun(testrun)
                    .build());
        }));

        List<TestrunUserDTO> testrunUserList = new ArrayList<>();
        boolean isRandom = !TestrunIterationUserFilterSelectRuleCode.SEQ.equals(testrunIterationDTO.getTestrunIterationUserFilterSelectRule());
        boolean isFirst = false;
        Random random = new Random();
        int filteringUserCount = testrunIterationDTO.getFilteringUserCount() == null ? 0 : testrunIterationDTO.getFilteringUserCount();
        if (filteringUserCount > testrunIterationDTO.getTestrunUsers().size()) {
            filteringUserCount = testrunIterationDTO.getTestrunUsers().size();
        }
        int totalTestrunUserCount = testrunIterationDTO.getTestrunUsers().size();

        if (TestrunIterationUserFilterTypeCode.TESTRUN.equals(testrunIterationDTO.getTestrunIterationUserFilterType())) {

            if (isRandom) {
                while (testrunUserList.size() < filteringUserCount) {
                    int userIndex = random.nextInt(testrunIterationDTO.getTestrunUsers().size());
                    if (testrunUserList.stream().noneMatch(testrunUserDTO -> testrunUserDTO.getUser().getId()
                        .equals(testrunIterationDTO.getTestrunUsers().get(userIndex).getUser().getId()))) {
                        TestrunUserDTO testrunUser = testrunIterationDTO.getTestrunUsers().get(userIndex);
                        testrunUserList.add(TestrunUserDTO
                            .builder()
                            .testrun(testrun)
                            .user(UserDTO.builder().id(testrunUser.getUser().getId()).build())
                            .build());
                    }
                }
            } else {
                if (testrunIterationDTO.getFilteringUserCursor() == null) {
                    testrunIterationDTO.setFilteringUserCursor(0);
                }

                int currentIndex = testrunIterationDTO.getFilteringUserCursor();
                if (currentIndex < 0 || currentIndex > totalTestrunUserCount - 1) {
                    currentIndex = 0;
                }

                while (testrunUserList.size() < filteringUserCount) {
                    TestrunUserDTO testrunUser = testrunIterationDTO.getTestrunUsers().get(currentIndex);
                    testrunUserList.add(TestrunUserDTO
                        .builder()
                        .testrun(testrun)
                        .user(UserDTO.builder().id(testrunUser.getUser().getId()).build())
                        .build());

                    currentIndex += 1;

                    if (currentIndex > totalTestrunUserCount - 1) {
                        currentIndex = 0;
                    }

                    testrunIterationDTO.setFilteringUserCursor(currentIndex);
                }
            }


        } else if (TestrunIterationUserFilterTypeCode.WEEKLY.equals(testrunIterationDTO.getTestrunIterationUserFilterType())
            || TestrunIterationUserFilterTypeCode.MONTHLY.equals(testrunIterationDTO.getTestrunIterationUserFilterType())) {

            boolean needChange = false;
            if (TestrunIterationUserFilterTypeCode.WEEKLY.equals(testrunIterationDTO.getTestrunIterationUserFilterType())) {
                if (testrunIterationDTO.getFilteringUserCursor() == null) {
                    testrunIterationDTO.setFilteringUserCursor(currentWeek);
                    needChange = true;
                    isFirst = true;
                } else if (!testrunIterationDTO.getFilteringUserCursor().equals(currentWeek)) {
                    testrunIterationDTO.setFilteringUserCursor(currentWeek);
                    needChange = true;
                }
            }

            if (TestrunIterationUserFilterTypeCode.MONTHLY.equals(testrunIterationDTO.getTestrunIterationUserFilterType())) {
                if (testrunIterationDTO.getFilteringUserCursor() == null) {
                    testrunIterationDTO.setFilteringUserCursor(currentMonth);
                    needChange = true;
                    isFirst = true;
                } else if (!testrunIterationDTO.getFilteringUserCursor().equals(currentMonth)) {
                    testrunIterationDTO.setFilteringUserCursor(currentMonth);
                    needChange = true;
                }
            }

            // 지난 데이터가 부족하다면, 채워놓기
            List<Long> savedUserIds = testrunIterationDTO.getCurrentFilteringUserIds();
            List<Long> userIds = new ArrayList<>();
            if (savedUserIds != null) {
                userIds = new ArrayList<>(savedUserIds);
            }

            // 없는 사용자 번호 제거
            userIds.removeIf((userId) -> testrunIterationDTO.getTestrunUsers().stream()
                .noneMatch(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(userId)));

            if (userIds.size() < filteringUserCount) {
                if (isRandom) {
                    while (userIds.size() < filteringUserCount) {
                        int userIndex = random.nextInt(testrunIterationDTO.getTestrunUsers().size());
                        if (userIds.stream()
                            .noneMatch(userId -> userId.equals(testrunIterationDTO.getTestrunUsers().get(userIndex).getUser().getId()))) {
                            TestrunUserDTO testrunUser = testrunIterationDTO.getTestrunUsers().get(userIndex);
                            userIds.add(testrunUser.getUser().getId());
                        }
                    }
                } else {
                    Long lastUserId = null;
                    if (!userIds.isEmpty()) {
                        lastUserId = userIds.get(userIds.size() - 1);
                    }

                    int currentIndex = 0;
                    if (lastUserId != null) {
                        Long finalLastUserId = lastUserId;
                        TestrunUserDTO lastUser = testrunIterationDTO.getTestrunUsers().stream()
                            .filter((testrunUserDTO -> finalLastUserId.equals(testrunUserDTO.getUser().getId()))).findFirst().orElse(null);
                        if (lastUser != null) {
                            currentIndex = testrunIterationDTO.getTestrunUsers().indexOf(lastUser);
                        }
                    }

                    if (currentIndex < 0) {
                        currentIndex = 0;
                    }

                    while (userIds.size() < filteringUserCount) {
                        TestrunUserDTO testrunUser = testrunIterationDTO.getTestrunUsers().get(currentIndex);
                        testrunUserList.add(TestrunUserDTO
                            .builder()
                            .testrun(testrun)
                            .user(UserDTO.builder().id(testrunUser.getUser().getId()).build())
                            .build());
                        userIds.add(testrunUser.getUser().getId());

                        currentIndex += 1;

                        if (currentIndex > totalTestrunUserCount - 1) {
                            currentIndex = 0;
                        }
                    }
                }
            } else if (userIds.size() > filteringUserCount) {
                for (int i = 0; i < userIds.size() - filteringUserCount; i++) {
                    userIds.remove(i);
                }
            }

            if (!isFirst && needChange) {
                if (isRandom) {
                    userIds.clear();
                    testrunUserList.clear();
                    while (userIds.size() < filteringUserCount) {
                        int userIndex = random.nextInt(testrunIterationDTO.getTestrunUsers().size());
                        if (userIds.stream()
                            .noneMatch(userId -> userId.equals(testrunIterationDTO.getTestrunUsers().get(userIndex).getUser().getId()))) {
                            TestrunUserDTO testrunUser = testrunIterationDTO.getTestrunUsers().get(userIndex);
                            userIds.add(testrunUser.getUser().getId());
                        }
                    }
                } else {
                    Long lastUserId = null;
                    if (!userIds.isEmpty()) {
                        lastUserId = userIds.get(userIds.size() - 1);
                    }

                    int currentIndex = 0;
                    if (lastUserId != null) {
                        Long finalLastUserId = lastUserId;
                        TestrunUserDTO lastUser = testrunIterationDTO.getTestrunUsers().stream()
                            .filter((testrunUserDTO -> finalLastUserId.equals(testrunUserDTO.getUser().getId()))).findFirst().orElse(null);
                        if (lastUser != null) {
                            currentIndex = testrunIterationDTO.getTestrunUsers().indexOf(lastUser);
                        }
                    }

                    if (currentIndex < 0) {
                        currentIndex = 0;
                    }

                    userIds.clear();
                    testrunUserList.clear();
                    while (userIds.size() < filteringUserCount) {
                        currentIndex += 1;
                        if (currentIndex > totalTestrunUserCount - 1) {
                            currentIndex = 0;
                        }
                        TestrunUserDTO testrunUser = testrunIterationDTO.getTestrunUsers().get(currentIndex);
                        userIds.add(testrunUser.getUser().getId());
                    }
                }
            }

            testrunIterationDTO.setCurrentFilteringUserIds(userIds);

            userIds.forEach(userId -> {
                testrunIterationDTO.getTestrunUsers().stream()
                    .filter(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(userId))
                    .findFirst()
                    .ifPresent(testrunUser ->
                        testrunUserList.add(TestrunUserDTO
                            .builder()
                            .testrun(testrun)
                            .user(UserDTO.builder().id(testrunUser.getUser().getId()).build())
                            .build()
                        )
                    );
            });

        } else {

            // 필터가 없으면 모든 테스트런 사용자 추가
            for (TestrunUserDTO testrunUser : testrunIterationDTO.getTestrunUsers()) {
                testrunUserList.add(TestrunUserDTO
                    .builder()
                    .testrun(testrun)
                    .user(UserDTO.builder().id(testrunUser.getUser().getId()).build())
                    .build()
                );
            }

        }

        testrun.setTestrunUsers(testrunUserList);

        List<TestrunTestcaseGroupDTO> testcaseGroups = new ArrayList<>();

        if (testrunIterationDTO.getTestcaseGroups() != null) {
            testrunIterationDTO.getTestcaseGroups().forEach((testrunTestcaseGroupDTO -> {
                TestrunTestcaseGroupDTO testcaseGroup = TestrunTestcaseGroupDTO
                    .builder()
                    .testrun(testrun)
                    .testcaseGroup(testrunTestcaseGroupDTO.getTestcaseGroup())
                    .build();

                List<TestrunTestcaseGroupTestcaseDTO> testrunTestcaseGroupTestcaseList = new ArrayList<>();
                for (TestrunTestcaseGroupTestcaseDTO testcase : testrunTestcaseGroupDTO.getTestcases()) {
                    testrunTestcaseGroupTestcaseList.add(TestrunTestcaseGroupTestcaseDTO
                        .builder()
                        .testcase(testcase.getTestcase())
                        .testrunTestcaseGroup(testcaseGroup)
                        .build());
                }

                testcaseGroup.setTestcases(testrunTestcaseGroupTestcaseList);
                testcaseGroups.add(testcaseGroup);
            }));
        }

        testrun.setTestcaseGroups(testcaseGroups);

        // testrunService.updateTestrunIterationCursor(testrunIterationDTO.getId(), testrunIterationDTO.getFilteringUserCursor(), testrunIterationDTO.getCurrentFilteringUserIds());
        testrunIterationService.updateTestrunIterationInfo(spaceDTO.getCode(), testrunIterationDTO, true);

        return testrun;
    }

    @Scheduled(cron = "0 * * * * *")
    public void createTestrunScheduler() {
        LocalDateTime now = LocalDateTime.now();
        String nowStartTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmm"));

        // 예약 테스트런
        List<TestrunReservationDTO> testrunReservationList = testrunReservationService.selectReserveTestrunList();
        testrunReservationList.forEach((testrunReservation -> {
            String spaceCode = projectService.selectSpaceCode(testrunReservation.getProject().getId());
            Long testrunReservationId = testrunReservation.getId();
            LocalDateTime startDateTime = testrunReservation.getStartDateTime();

            if (now.isAfter(startDateTime)) {
                TestrunReservationDTO target = testrunReservationService.selectTestrunReservationInfo(testrunReservation.getId());
                TestrunDTO testrun = getTestrun(target, now);
                TestrunDTO result = testrunService.createTestrunInfo(spaceCode, testrun);
                testrunReservationService.updateTestrunReserveExpired(testrunReservationId, true, result.getId());

                // 시작 후 훅 호출
                result.getTestrunHookList(TestrunHookTiming.AFTER_START).forEach(testrunHook -> {
                    testrunHook.request(httpRequestUtil);
                    testrunHook.setTestrun(TestrunDTO.builder().id(result.getId()).build());
                    testrunService.updateTestrunHookResult(testrunHook);
                });
            }
        }));

        // 반복 테스트런
        List<TestrunIterationDTO> testrunIterationList = testrunIterationService.selectTestrunIterationList();
        testrunIterationList.forEach((testrunIterationDTO -> {

            Long testrunIterationId = testrunIterationDTO.getId();
            String spaceCode = projectService.selectSpaceCode(testrunIterationDTO.getProject().getId());
            SpaceDTO spaceDTO = spaceService.selectSpaceInfo(spaceCode);

            Locale spaceLocale = spaceDTO.getCountry() != null ? new Locale(spaceDTO.getCountry()) : Locale.US;
            WeekFields weekFields = WeekFields.of(spaceLocale);
            TemporalField weekOfMonth = weekFields.weekOfMonth();

            LocalDateTime reserveStartDateTime = testrunIterationDTO.getReserveStartDateTime();
            LocalDateTime reserveEndDateTime = testrunIterationDTO.getReserveEndDateTime();

            String startTime = testrunIterationDTO.getStartTime().format(DateTimeFormatter.ofPattern("HHmm"));

            // 시간 설정 없는 경우, 스킵
            if (reserveStartDateTime == null && reserveEndDateTime == null) {
                return;
            }

            ZonedDateTime nowUTC = ZonedDateTime.of(now, ZoneId.of("UTC"));
            ZonedDateTime zonedNow = nowUTC.withZoneSameInstant(ZoneId.of(spaceDTO.getTimeZone() != null ? spaceDTO.getTimeZone() : "UTC"));
            int dayOfMonth = zonedNow.getDayOfMonth();

            // 주단위 반복인데, 요일이 맞지 않는 경우, 스킵
            if (TestrunIterationTimeTypeCode.WEEKLY.equals(testrunIterationDTO.getTestrunIterationTimeType())
                && testrunIterationDTO.getDays().charAt(zonedNow.getDayOfWeek().getValue() - 1) != '1') {
                return;
            }

            // 월 단위 반복이고, -2, -1이 아니고, 현재 일자와 맞지 않는 경우, 스킵
            if (TestrunIterationTimeTypeCode.MONTHLY.equals(testrunIterationDTO.getTestrunIterationTimeType())
                && testrunIterationDTO.getDate() != dayOfMonth && testrunIterationDTO.getDate() > 0) {
                return;
            }

            int currentMonth = zonedNow.getMonthValue();
            int currentWeek = zonedNow.get(weekOfMonth);
            int currentDay = zonedNow.getDayOfWeek().getValue();
            int currentDate = zonedNow.getDayOfMonth();

            List<HolidayDTO> holidays = spaceDTO.getHolidays();
            String nowDay = zonedNow.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String nowYear = zonedNow.format(DateTimeFormatter.ofPattern("yyyy"));
            LocalDate startDateOfMonth = LocalDate.of(zonedNow.getYear(), zonedNow.getMonth(), 1);
            LocalDate endDateOfMonth = startDateOfMonth.plusDays(startDateOfMonth.lengthOfMonth() - 1);
            double nowDayOfMonth = zonedNow.getDayOfMonth();
            double weekTimes = Math.ceil(nowDayOfMonth / 7.0);
            int lastWeek = endDateOfMonth.get(weekOfMonth);
            int lastDate = startDateOfMonth.lengthOfMonth();

            // 월 단위 반복이고, -1인 경우인데, 마지막 일자랑 같지 않다면 스킵
            if (TestrunIterationTimeTypeCode.MONTHLY.equals(testrunIterationDTO.getTestrunIterationTimeType()) && testrunIterationDTO.getDate() == -1
                && currentDate != lastDate) {
                return;
            }

            boolean isHoliday = holidays.stream().anyMatch((holidayDTO -> {

                if (HolidayTypeCode.YEARLY.equals(holidayDTO.getHolidayType()) || HolidayTypeCode.SPECIFIED_DATE.equals(holidayDTO.getHolidayType())) {
                    String holiday = null;
                    if (HolidayTypeCode.YEARLY.equals(holidayDTO.getHolidayType())) {
                        holiday = nowYear + holidayDTO.getDate();
                    } else {
                        holiday = holidayDTO.getDate();
                    }
                    return nowDay.equals(holiday);
                } else if (HolidayTypeCode.CONDITION.equals(holidayDTO.getHolidayType())) {
                    Integer month = holidayDTO.getMonth();
                    Integer week = holidayDTO.getWeek();
                    Integer day = holidayDTO.getDay();

                    if (!(currentMonth == month || month == -1)) {
                        return false;
                    }

                    // 마지막주의 경우, 현재 주 값이랑 달의 마지막 날짜의 주 값이랑 동일한 경우 참
                    // 마지막인 경우, 요일이 같고, 달의 마지막 날짜까지 해당 요일이 없는 경우 참
                    if (!((week == currentWeek)
                        || (week == 6 && lastWeek == currentWeek)
                        || (week == 7 && day == currentDay && (endDateOfMonth.getDayOfMonth() - zonedNow.getDayOfMonth()) < 7)
                        || ((week >= 8 && week <= 11) && (day == currentDay) && (weekTimes == (week - 7)))
                    )) {
                        return false;
                    }

                    return day == currentDay;
                }

                return false;
            }));

            // TODO 첫번째 워킹데이 (-2), 말일 -1 처리
            // MONTHLY의 첫번째 워킹데이가 아니고, 휴일 제외 설정이 되어 있는데, 휴일인 경우, 스킵
            if (!(TestrunIterationTimeTypeCode.MONTHLY.equals(testrunIterationDTO.getTestrunIterationTimeType())
                && testrunIterationDTO.getDate() == -2)
                && testrunIterationDTO.getExcludeHoliday() != null && testrunIterationDTO.getExcludeHoliday()
                && isHoliday) {
                return;
            }

            // 월/주 설정인데, 주와 요일 설정이 맞지 않는다면, 스킵
            if (TestrunIterationTimeTypeCode.MONTHLY_WEEKLY.equals(testrunIterationDTO.getTestrunIterationTimeType())
                && !((testrunIterationDTO.getWeek() == currentWeek)
                || (testrunIterationDTO.getWeek() == 6 && lastWeek == currentWeek)
                || (testrunIterationDTO.getWeek() == 7 && testrunIterationDTO.getDay() == currentDay
                && (endDateOfMonth.getDayOfMonth() - zonedNow.getDayOfMonth()) < 7)
                || ((testrunIterationDTO.getWeek() >= 8 && testrunIterationDTO.getWeek() <= 11) && (testrunIterationDTO.getDay() == currentDay) && (
                weekTimes == (testrunIterationDTO.getWeek() - 7)))
            )) {
                return;
            }

            // String nowStartHour = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH")); // FOR TEST
            // String startHour = testrunIterationDTO.getStartTime().format(DateTimeFormatter.ofPattern("HH")); // FOR TEST

            if ((reserveStartDateTime == null || now.isAfter(reserveStartDateTime)) && (reserveEndDateTime == null || now.isBefore(reserveEndDateTime)) && nowStartTime.equals(startTime)) {
                // if ((reserveStartDateTime == null || now.isAfter(reserveStartDateTime)) && (reserveEndDateTime == null || now.isBefore(reserveEndDateTime)) && nowStartHour.equals(startHour)) { // FOR TEST

                TestrunIterationDTO target = testrunIterationService.selectTestrunIterationInfo(testrunIterationDTO.getId());
                TestrunDTO testrun = getTestrun(spaceDTO, target, now, currentMonth, currentWeek);
                TestrunDTO result = testrunService.createTestrunInfo(testrun.getProject().getSpace().getCode(), testrun);

                // 시작 후 훅 호출
                result.getTestrunHookList(TestrunHookTiming.AFTER_START).forEach(testrunHook -> {
                    testrunHook.request(httpRequestUtil);
                    testrunHook.setTestrun(TestrunDTO.builder().id(result.getId()).build());
                    testrunService.updateTestrunHookResult(testrunHook);
                });
            }

            if (reserveEndDateTime != null && now.isAfter(reserveEndDateTime)) {
                testrunIterationService.updateTestrunIterationExpired(testrunIterationId, true);
            }

        }));

    }

    @Scheduled(cron = "0 * * * * *")
    public void closeTestrunScheduler() {
        LocalDateTime now = LocalDateTime.now();
        List<TestrunDTO> testrunList = testrunService.selectToBeClosedTestrunList(now);
        testrunList.forEach((testrunDTO -> {
            String spaceCode = projectService.selectSpaceCode(testrunDTO.getProject().getId());
            TestrunDTO result = testrunService.updateProjectTestrunStatusClosed(spaceCode, testrunDTO.getProject().getId(),
                testrunDTO.getId());

            // 종료 후 훅 호출
            result.getTestrunHookList(TestrunHookTiming.AFTER_END).forEach(testrunHook -> {
                testrunHook.request(httpRequestUtil);
                testrunHook.setTestrun(TestrunDTO.builder().id(result.getId()).build());
                testrunService.updateTestrunHookResult(testrunHook);
            });
        }));
    }

    private boolean isSameTimeUntilMinute(LocalDateTime time1, LocalDateTime time2) {
        if (time1 == null || time2 == null) {
            return false;
        }

        return time1.getYear() == time2.getYear()
            && time1.getMonthValue() == time2.getMonthValue()
            && time1.getDayOfMonth() == time2.getDayOfMonth()
            && time1.getHour() == time2.getHour()
            && time1.getMinute() == time2.getMinute();
    }

    @Scheduled(cron = "0 * * * * *")
    public void testrunNotificationScheduler() {
        LocalDateTime now = LocalDateTime.now();
        List<TestrunListDTO> testrunList = testrunService.selectOpenedTestrunList();

        // 절반이 수행된 테스트런 알림 발송
        testrunList.forEach((testrunListDTO -> {

            LocalDateTime last30 = testrunListDTO.getEndDateTime().minusMinutes(30);
            LocalDateTime last60 = testrunListDTO.getEndDateTime().minusMinutes(60);
            LocalDateTime halfTime = null;
            if (testrunListDTO.getStartDateTime() != null) {
                long spanMinutes = ChronoUnit.MINUTES.between(testrunListDTO.getStartDateTime(), testrunListDTO.getEndDateTime());
                halfTime = testrunListDTO.getStartDateTime().plusMinutes(spanMinutes / 2);
            }

            if (isSameTimeUntilMinute(now, last30) || isSameTimeUntilMinute(now, last60) || isSameTimeUntilMinute(now, halfTime)) {
                Long projectId = testrunListDTO.getProject().getId();
                String spaceCode = projectService.selectSpaceCode(projectId);
                ProjectDTO project = projectCachedService.selectProjectInfo(spaceCode, projectId);
                List<TestrunMessageChannelDTO> testrunMessageChannelList = testrunService.selectTestrunMessageChannelList(testrunListDTO.getId());

                if (!testrunMessageChannelList.isEmpty()) {
                    Map<Long, Integer> userRemainCount = new HashMap<>();
                    List<TestrunTestcaseGroupTestcaseUserTestResultDTO> untestedTestcaseList = testrunService.selectUntestedTestrunTestcaseGroupTestcaseList(testrunListDTO.getId());
                    for (TestrunTestcaseGroupTestcaseUserTestResultDTO userTestrunResult : untestedTestcaseList) {
                        Long testerId = userTestrunResult.getTester() != null ? userTestrunResult.getTester().getId() : null;
                        if (userRemainCount.containsKey(testerId)) {
                            userRemainCount.put(testerId, userRemainCount.get(testerId) + 1);
                        } else {
                            userRemainCount.put(testerId, 1);
                        }
                    }

                    String message;
                    if (isSameTimeUntilMinute(now, last30)) {
                        message = messageSourceAccessor.getMessage("testrun.30m.left", new Object[]{testrunListDTO.getName()});
                    } else if (isSameTimeUntilMinute(now, last60)) {
                        message = messageSourceAccessor.getMessage("testrun.60m.left", new Object[]{testrunListDTO.getName()});
                    } else {
                        message = messageSourceAccessor.getMessage("testrun.half.time.left", new Object[]{testrunListDTO.getName()});
                    }

                    testrunMessageChannelList.forEach(testrunMessageChannel -> {
                        messageChannelService.sendTestrunRemainInfo(testrunMessageChannel.getMessageChannel().getMessageChannel(), spaceCode, projectId, message, testrunListDTO.getId(),
                            testrunListDTO.getName(), project.getUsers(), userRemainCount);
                    });
                }

            }
        }));


    }
}
