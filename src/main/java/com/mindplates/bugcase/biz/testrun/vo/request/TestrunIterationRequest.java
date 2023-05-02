package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.*;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.TestrunCreationTypeCode;
import com.mindplates.bugcase.common.code.TestrunIterationTimeTypeCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterSelectRuleCode;
import com.mindplates.bugcase.common.code.TestrunIterationUserFilterTypeCode;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TestrunIterationRequest {
    private Long id;
    private String name;
    private String description;
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
    private Integer date;
    private Integer week;
    private Integer day;
    private TestrunIterationUserFilterTypeCode testrunIterationUserFilterType;
    private TestrunIterationUserFilterSelectRuleCode testrunIterationUserFilterSelectRule;
    private Integer filteringUserCount;

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
                .date(date)
                .week(week)
                .day(day)
                .testrunIterationUserFilterType(testrunIterationUserFilterType)
                .testrunIterationUserFilterSelectRule(testrunIterationUserFilterSelectRule)
                .filteringUserCount(filteringUserCount)
                .build();

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


        return testrunIteration;
    }


}
