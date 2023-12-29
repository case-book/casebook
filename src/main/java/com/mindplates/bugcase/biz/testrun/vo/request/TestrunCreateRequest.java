package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunProfileDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestrunCreateRequest {

    private Long id;
    private String name;
    private String description;
    private Long projectId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private boolean opened;
    private List<TestrunUserRequest> testrunUsers;
    private List<TestrunTestcaseGroupRequest> testcaseGroups;
    private String days;
    private boolean excludeHoliday;
    private LocalDateTime startTime;
    private int durationHours;
    private boolean deadlineClose;
    private List<Long> profileIds;
    private List<TestrunHookRequest> hooks;

    public TestrunDTO buildEntity() {

        TestrunDTO testrun = TestrunDTO.builder()
            .id(id)
            .name(name)
            .description(description)
            .project(ProjectDTO.builder().id(projectId).build())
            .startDateTime(startDateTime)
            .endDateTime(endDateTime)
            .opened(opened)
            .days(days)
            .excludeHoliday(excludeHoliday)
            .startTime(startTime.toLocalTime())
            .durationHours(durationHours)
            .deadlineClose(deadlineClose)
            .build();

        testrun.setHooks(hooks.stream().map((testrunHookRequest -> {
            TestrunHookDTO testrunHookDTO = testrunHookRequest.buildEntity();
            testrunHookDTO.setTestrun(testrun);
            return testrunHookDTO;
        })).collect(Collectors.toList()));

        if (profileIds != null) {
            AtomicInteger index = new AtomicInteger();
            testrun.setProfiles(
                profileIds.stream()
                    .map((profileId) ->
                        TestrunProfileDTO.builder()
                            .testrun(testrun)
                            .profile(SpaceProfileDTO.builder().id(profileId).build())
                            .itemOrder(index.getAndIncrement())
                            .build())
                    .collect(Collectors.toList()));
        }

        if (testrunUsers != null) {
            List<TestrunUserDTO> users = testrunUsers.stream().map((testrunUserRequest) -> TestrunUserDTO.builder().id(testrunUserRequest.getId())
                .user(UserDTO.builder().id(testrunUserRequest.getUserId()).build()).testrun(testrun).build()).collect(Collectors.toList());

            testrun.setTestrunUsers(users);
        }

        if (testcaseGroups != null) {
            List<TestrunTestcaseGroupDTO> groups = testcaseGroups.stream().map((testrunTestcaseGroupRequest) -> {
                TestrunTestcaseGroupDTO testrunTestcaseGroup = TestrunTestcaseGroupDTO
                    .builder()
                    .id(testrunTestcaseGroupRequest.getId())
                    .testrun(testrun)
                    .testcaseGroup(TestcaseGroupDTO.builder().id(testrunTestcaseGroupRequest.getTestcaseGroupId()).build())
                    .build();

                if (testrunTestcaseGroupRequest.getTestcases() != null) {
                    List<TestrunTestcaseGroupTestcaseDTO> testcases = testrunTestcaseGroupRequest.getTestcases().stream().map(
                            (testrunTestcaseGroupTestcaseRequest) -> TestrunTestcaseGroupTestcaseDTO.builder()
                                .id(testrunTestcaseGroupTestcaseRequest.getId()).testrunTestcaseGroup(testrunTestcaseGroup)
                                .testcase(TestcaseDTO.builder().id(testrunTestcaseGroupTestcaseRequest.getTestcaseId()).build()).build())
                        .collect(Collectors.toList());

                    testrunTestcaseGroup.setTestcases(testcases);
                }

                return testrunTestcaseGroup;
            }).collect(Collectors.toList());

            testrun.setTestcaseGroups(groups);
        }

        return testrun;
    }


}
