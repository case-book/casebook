package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunIterationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunProfileDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.TestrunIterationTimeTypeCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterSelectRuleCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterTypeCode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import javax.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TestrunIterationRequest {

    private Long id;
    private String name;
    private String description;
    @NotEmpty
    private List<TestrunUserRequest> testrunUsers;
    private List<TestrunTestcaseGroupRequest> testcaseGroups;
    private Long projectId;
    private LocalDateTime reserveStartDateTime;
    private LocalDateTime reserveEndDateTime;
    private TestrunIterationTimeTypeCode testrunIterationTimeType;
    private boolean excludeHoliday;
    private int durationHours;
    private String days;
    private LocalDateTime startTime;
    private boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private Integer date;
    private Integer week;
    private Integer day;
    private TestrunIterationUserFilterTypeCode testrunIterationUserFilterType;
    private TestrunIterationUserFilterSelectRuleCode testrunIterationUserFilterSelectRule;
    private Integer filteringUserCount;
    private List<Long> profileIds;
    private List<TestrunHookRequest> hooks;
    private List<TestrunMessageChannelRequest> messageChannels;

    public TestrunIterationDTO buildEntity() {

        TestrunIterationDTO testrunIteration = TestrunIterationDTO.builder()
            .id(id)
            .name(name)
            .description(description)
            .project(ProjectDTO.builder().id(projectId).build())
            .reserveStartDateTime(reserveStartDateTime)
            .reserveEndDateTime(reserveEndDateTime)
            .testrunIterationTimeType(testrunIterationTimeType)
            .excludeHoliday(excludeHoliday)
            .durationHours(durationHours)
            .days(days)
            .startTime(startTime.toLocalTime())
            .deadlineClose(deadlineClose)
            .autoTestcaseNotAssignedTester(autoTestcaseNotAssignedTester)
            .date(date)
            .week(week)
            .day(day)
            .testrunIterationUserFilterType(testrunIterationUserFilterType)
            .testrunIterationUserFilterSelectRule(testrunIterationUserFilterSelectRule)
            .filteringUserCount(filteringUserCount)
            .build();

        if (hooks != null) {
            testrunIteration.setHooks(hooks.stream().map((testrunHookRequest -> {
                TestrunHookDTO testrunHookDTO = testrunHookRequest.toDTO();
                testrunHookDTO.setTestrunIteration(testrunIteration);
                return testrunHookDTO;
            })).collect(Collectors.toList()));
        }

        if (profileIds != null) {
            AtomicInteger index = new AtomicInteger();
            testrunIteration.setProfiles(
                profileIds.stream()
                    .map((profileId) ->
                        TestrunProfileDTO.builder()
                            .testrunIteration(testrunIteration)
                            .profile(SpaceProfileDTO.builder().id(profileId).build())
                            .itemOrder(index.getAndIncrement())
                            .build())
                    .collect(Collectors.toList()));
        }

        if (testrunUsers != null) {
            List<TestrunUserDTO> users = testrunUsers
                .stream()
                .map((testrunUserRequest) ->
                    TestrunUserDTO
                        .builder()
                        .id(testrunUserRequest.getId())
                        .user(UserDTO.builder().id(testrunUserRequest.getUserId()).build())
                        .testrunIteration(testrunIteration).build())
                .collect(Collectors.toList());
            testrunIteration.setTestrunUsers(users);
        }

        if (testcaseGroups != null) {
            List<TestrunTestcaseGroupDTO> groups = testcaseGroups.stream().map((testrunTestcaseGroupRequest) -> {
                TestrunTestcaseGroupDTO testrunTestcaseGroup = TestrunTestcaseGroupDTO
                    .builder()
                    .id(testrunTestcaseGroupRequest.getId())
                    .testrunIteration(testrunIteration)
                    .testcaseGroup(TestcaseGroupDTO.builder().id(testrunTestcaseGroupRequest.getTestcaseGroupId()).build())
                    .build();

                if (testrunTestcaseGroupRequest.getTestcases() != null) {
                    List<TestrunTestcaseGroupTestcaseDTO> testcases = testrunTestcaseGroupRequest
                        .getTestcases()
                        .stream()
                        .map((testrunTestcaseGroupTestcaseRequest) ->
                            TestrunTestcaseGroupTestcaseDTO
                                .builder()
                                .id(testrunTestcaseGroupTestcaseRequest.getId())
                                .testrunTestcaseGroup(testrunTestcaseGroup)
                                .testcase(TestcaseDTO.builder().id(testrunTestcaseGroupTestcaseRequest.getTestcaseId()).build())
                                .build())
                        .collect(Collectors.toList());

                    testrunTestcaseGroup.setTestcases(testcases);
                }

                return testrunTestcaseGroup;
            }).collect(Collectors.toList());

            testrunIteration.setTestcaseGroups(groups);
        }

        if (messageChannels != null) {
            testrunIteration.setMessageChannels(messageChannels.stream().map((testrunMessageChannelRequest) -> {
                TestrunMessageChannelDTO testrunMessageChannel = testrunMessageChannelRequest.toDTO();
                testrunMessageChannel.setTestrunIteration(testrunIteration);
                return testrunMessageChannel;
            }).collect(Collectors.toList()));
        }

        return testrunIteration;
    }


}
