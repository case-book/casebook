package com.mindplates.bugcase.framework.scheduler;

import com.mindplates.bugcase.biz.space.dto.HolidayDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.common.code.HolidayTypeCode;
import com.mindplates.bugcase.common.code.TestrunCreationTypeCode;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalField;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;

@Component
@Slf4j
@AllArgsConstructor
public class TestrunScheduler {

    private final TestrunService testrunService;

    private final SpaceService spaceService;

    private void clearTestrun(TestrunDTO testrunDTO) {
        testrunDTO.setId(null);
        testrunDTO.setCreationType(TestrunCreationTypeCode.CREATE);
        if (testrunDTO.getTestrunUsers() != null) {
            for (TestrunUserDTO testrunUser : testrunDTO.getTestrunUsers()) {
                testrunUser.setId(null);
                testrunUser.setTestrun(testrunDTO);
            }
        }

        if (testrunDTO.getTestcaseGroups() != null) {
            testrunDTO.getTestcaseGroups().forEach((testrunTestcaseGroupDTO -> {
                testrunTestcaseGroupDTO.setId(null);
                testrunTestcaseGroupDTO.setTestrun(testrunDTO);
                for (TestrunTestcaseGroupTestcaseDTO testcase : testrunTestcaseGroupDTO.getTestcases()) {
                    testcase.setId(null);
                    testcase.setTestrunTestcaseGroup(testrunTestcaseGroupDTO);
                    for (TestrunTestcaseGroupTestcaseItemDTO testcaseItem : testcase.getTestcaseItems()) {
                        testcaseItem.setId(null);
                    }
                    testcase.getTester().setId(null);
                }
            }));
        }
    }

    @Scheduled(cron = "0 * * * * *")
    public void createTestrunScheduler() {
        LocalDateTime now = LocalDateTime.now();
        String nowStartTime = LocalDateTime.now().format(DateTimeFormatter.ofPattern("HHmm"));
        List<TestrunDTO> testrunList = testrunService.selectReserveTestrunList();
        testrunList.forEach((testrunDTO -> {
            if (TestrunCreationTypeCode.RESERVE.equals(testrunDTO.getCreationType())) {
                Long testrunId = testrunDTO.getId();
                LocalDateTime startDateTime = testrunDTO.getStartDateTime();

                if (now.isAfter(startDateTime)) {
                    clearTestrun(testrunDTO);
                    TestrunDTO result = testrunService.createTestrunInfo(testrunDTO.getProject().getSpace().getCode(), testrunDTO);
                    testrunService.updateTestrunReserveExpired(testrunId, true, result.getId());
                }
            } else if (TestrunCreationTypeCode.ITERATION.equals(testrunDTO.getCreationType())) {

                Long testrunId = testrunDTO.getId();
                Long spaceId = testrunDTO.getProject().getSpace().getId();
                SpaceDTO spaceDTO = spaceService.selectSpaceInfo(spaceId);

                Locale spaceLocale = spaceDTO.getCountry() != null ? new Locale(spaceDTO.getCountry()) : Locale.US;
                WeekFields weekFields = WeekFields.of(spaceLocale);
                TemporalField weekOfMonth = weekFields.weekOfMonth();

                LocalDateTime startDateTime = testrunDTO.getStartDateTime();
                LocalDateTime endDateTime = testrunDTO.getEndDateTime();
                String startTime = testrunDTO.getStartTime().format(DateTimeFormatter.ofPattern("HHmm"));

                if (startDateTime == null && endDateTime == null) {
                    return;
                }

                ZonedDateTime nowUTC = ZonedDateTime.of(now, ZoneId.of("UTC"));
                ZonedDateTime zonedNow = nowUTC.withZoneSameInstant(ZoneId.of(spaceDTO.getTimeZone()));

                log.error(now.getDayOfWeek().toString());
                log.error(zonedNow.getDayOfWeek().toString());

                if (testrunDTO.getDays().charAt(zonedNow.getDayOfWeek().getValue() - 1) != '1') {
                    return;
                }

                // TODO onHoliday -> exceptHoliday로 변경
                if (testrunDTO.getOnHoliday() != null && testrunDTO.getOnHoliday()) {
                    List<HolidayDTO> holidays = spaceDTO.getHolidays();
                    String nowDay = zonedNow.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                    String nowYear = zonedNow.format(DateTimeFormatter.ofPattern("yyyy"));
                    boolean isHoliday = holidays.stream().anyMatch((holidayDTO -> {

                        if (HolidayTypeCode.YEARLY.equals(holidayDTO.getHolidayType()) || HolidayTypeCode.SPECIFIED_DATE.equals(holidayDTO.getHolidayType())) {
                            String holiday = null;
                            if (HolidayTypeCode.YEARLY.equals(holidayDTO.getHolidayType())) {
                                holiday = nowYear + holidayDTO.getDate();
                            } else if (HolidayTypeCode.SPECIFIED_DATE.equals(holidayDTO.getHolidayType())) {
                                holiday = holidayDTO.getDate();
                            }
                            return nowDay.equals(holiday);
                        } else if (HolidayTypeCode.CONDITION.equals(holidayDTO.getHolidayType())) {
                            Integer month = holidayDTO.getMonth();
                            Integer week = holidayDTO.getWeek();
                            Integer day = holidayDTO.getDay();

                            int currentMonth = zonedNow.getMonthValue();
                            int currentWeek = zonedNow.get(weekOfMonth);
                            int currentDay = zonedNow.getDayOfWeek().getValue();

                            if (!(currentMonth == month || month == -1)) {
                                return false;
                            }

                            LocalDate startDateOfMonth = LocalDate.of(zonedNow.getYear(), zonedNow.getMonth(), 1);
                            LocalDate endDateOfMonth = startDateOfMonth.plusDays(startDateOfMonth.lengthOfMonth() - 1);
                            int lastWeek = endDateOfMonth.get(weekOfMonth);

                            // 마지막주의 경우, 현재 주 값이랑 달의 마지막 날짜의 주 값이랑 동일한 경우 참
                            // 마지막인 경우, 요일이 같고, 달의 마지막 날짜까지 해당 요일이 없는 경우 참
                            if (!((week == currentWeek) || (week == 6 && lastWeek == currentWeek) || (week == 7 && day == currentDay && (endDateOfMonth.getDayOfMonth() - zonedNow.getDayOfMonth()) < 7))) {
                                return false;
                            }

                            return day == currentDay;
                        }

                        return false;
                    }));

                    if (isHoliday) {
                        return;
                    }

                }

                if ((startDateTime == null || now.isAfter(startDateTime)) && (endDateTime == null || now.isBefore(endDateTime)) && nowStartTime.equals(startTime)) {
                    clearTestrun(testrunDTO);

                    testrunDTO.setStartDateTime(now);
                    testrunDTO.setEndDateTime(now.plusHours(testrunDTO.getDurationHours()));
                    testrunService.createTestrunInfo(testrunDTO.getProject().getSpace().getCode(), testrunDTO);
                }

                if (endDateTime != null && now.isAfter(endDateTime)) {
                    testrunService.updateTestrunReserveExpired(testrunId, true, null);
                }
            }
        }));

    }

    @Scheduled(cron = "0 * * * * *")
    public void closeTestrunScheduler() {
        LocalDateTime now = LocalDateTime.now();
        List<TestrunDTO> testrunList = testrunService.selectDeadlineTestrunList(now);
        testrunList.forEach((testrunDTO -> {
            testrunService.updateProjectTestrunStatusClosed(testrunDTO.getProject().getSpace().getCode(), testrunDTO.getProject().getId(), testrunDTO.getId());
        }));

    }
}
