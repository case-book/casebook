package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunReservationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunUserDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    private boolean selectCreatedTestcase;
    private boolean selectUpdatedTestcase;

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
                .selectCreatedTestcase(selectCreatedTestcase)
                .selectUpdatedTestcase(selectUpdatedTestcase)
                .build();

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


        return testrunReservation;
    }


}
