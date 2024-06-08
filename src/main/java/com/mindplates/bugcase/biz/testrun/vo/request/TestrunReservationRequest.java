package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunProfileDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunReservationDTO;
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
public class TestrunReservationRequest {

    private Long id;
    private Long projectId;
    private String name;
    private String description;
    private List<TestrunUserRequest> testrunUsers;
    private List<TestrunTestcaseGroupRequest> testcaseGroups;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private boolean expired;
    private boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private boolean selectCreatedTestcase;
    private boolean selectUpdatedTestcase;
    private List<Long> profileIds;
    private List<TestrunHookRequest> hooks;
    private List<TestrunMessageChannelRequest> messageChannels;


    public TestrunReservationDTO buildEntity() {

        TestrunReservationDTO testrunReservation = TestrunReservationDTO.builder()
            .id(id)
            .project(ProjectDTO.builder().id(projectId).build())
            .name(name)
            .description(description)
            .startDateTime(startDateTime)
            .endDateTime(endDateTime)
            .expired(expired)
            .deadlineClose(deadlineClose)
            .autoTestcaseNotAssignedTester(autoTestcaseNotAssignedTester)
            .selectCreatedTestcase(selectCreatedTestcase)
            .selectUpdatedTestcase(selectUpdatedTestcase)
            .build();

        if (hooks != null) {
            testrunReservation.setHooks(hooks.stream().map((testrunHookRequest -> {
                TestrunHookDTO testrunHookDTO = testrunHookRequest.buildEntity();
                testrunHookDTO.setTestrunReservation(testrunReservation);
                return testrunHookDTO;
            })).collect(Collectors.toList()));
        }

        if (profileIds != null) {
            AtomicInteger index = new AtomicInteger();
            testrunReservation.setProfiles(
                profileIds.stream()
                    .map((profileId) ->
                        TestrunProfileDTO.builder()
                            .testrunReservation(testrunReservation)
                            .profile(SpaceProfileDTO.builder().id(profileId).build())
                            .itemOrder(index.getAndIncrement())
                            .build())
                    .collect(Collectors.toList()));
        }

        if (testrunUsers != null) {
            List<TestrunUserDTO> users = testrunUsers.stream()
                .map((testrunUserRequest) -> TestrunUserDTO.builder().
                    id(testrunUserRequest.getId())
                    .user(UserDTO.builder().id(testrunUserRequest.getUserId()).build())
                    .testrunReservation(testrunReservation).build())
                .collect(Collectors.toList());

            testrunReservation.setTestrunUsers(users);
        }

        if (testcaseGroups != null) {
            List<TestrunTestcaseGroupDTO> groups = testcaseGroups.stream().map((testrunTestcaseGroupRequest) -> {
                TestrunTestcaseGroupDTO testrunTestcaseGroup = TestrunTestcaseGroupDTO
                    .builder()
                    .id(testrunTestcaseGroupRequest.getId())
                    .testrunReservation(testrunReservation)
                    .testcaseGroup(TestcaseGroupDTO.builder().id(testrunTestcaseGroupRequest.getTestcaseGroupId()).build())
                    .build();

                if (testrunTestcaseGroupRequest.getTestcases() != null) {
                    List<TestrunTestcaseGroupTestcaseDTO> testcases = testrunTestcaseGroupRequest.getTestcases()
                        .stream()
                        .map((testrunTestcaseGroupTestcaseRequest) -> TestrunTestcaseGroupTestcaseDTO
                            .builder()
                            .id(testrunTestcaseGroupTestcaseRequest.getId())
                            .testrunTestcaseGroup(testrunTestcaseGroup)
                            .testcase(TestcaseDTO
                                .builder()
                                .id(testrunTestcaseGroupTestcaseRequest.getTestcaseId())
                                .build())
                            .build())
                        .collect(Collectors.toList());

                    testrunTestcaseGroup.setTestcases(testcases);
                }

                return testrunTestcaseGroup;
            }).collect(Collectors.toList());

            testrunReservation.setTestcaseGroups(groups);
        }

        if (messageChannels != null) {
            testrunReservation.setMessageChannels(messageChannels.stream().map((testrunMessageChannelRequest) -> {
                TestrunMessageChannelDTO testrunMessageChannel = testrunMessageChannelRequest.toDTO();
                testrunMessageChannel.setTestrunReservation(testrunReservation);
                return testrunMessageChannel;
            }).collect(Collectors.toList()));
        }

        return testrunReservation;
    }


}
