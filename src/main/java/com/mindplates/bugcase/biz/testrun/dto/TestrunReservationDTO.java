package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunReservationDTO extends CommonDTO {

    private Long id;
    private String name;
    private String description;
    private List<TestrunUserDTO> testrunUsers;
    private List<TestrunTestcaseGroupDTO> testcaseGroups;
    private ProjectDTO project;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Boolean expired;
    private Boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private int testcaseGroupCount;
    private int testcaseCount;
    private TestrunDTO testrun;
    private Boolean selectCreatedTestcase;
    private Boolean selectUpdatedTestcase;

    private List<TestrunTestcaseGroupDTO> conditionalTestcaseGroupList;
    private List<TestrunProfileDTO> profiles;
    private List<TestrunHookDTO> hooks;
    private List<TestrunMessageChannelDTO> messageChannels;

    public TestrunReservationDTO(TestrunReservation testrunReservation) {
        this.id = testrunReservation.getId();
        this.name = testrunReservation.getName();
        this.description = testrunReservation.getDescription();
        this.startDateTime = testrunReservation.getStartDateTime();
        this.endDateTime = testrunReservation.getEndDateTime();
        this.expired = testrunReservation.getExpired();
        this.deadlineClose = testrunReservation.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrunReservation.getAutoTestcaseNotAssignedTester() != null && testrunReservation.getAutoTestcaseNotAssignedTester();
        this.testcaseGroupCount = Optional.ofNullable(testrunReservation.getTestcaseGroupCount()).orElse(0);
        this.testcaseCount = Optional.ofNullable(testrunReservation.getTestcaseCount()).orElse(0);
        this.selectCreatedTestcase = testrunReservation.getSelectCreatedTestcase();
        this.selectUpdatedTestcase = testrunReservation.getSelectUpdatedTestcase();
        this.creationDate = testrunReservation.getCreationDate();
        this.lastUpdateDate = testrunReservation.getLastUpdateDate();

        if (testrunReservation.getProject() != null) {
            this.project = ProjectDTO.builder().id(testrunReservation.getProject().getId()).build();
        }
        if (testrunReservation.getTestrun() != null) {
            this.testrun = TestrunDTO.builder().id(testrunReservation.getTestrun().getId()).build();
        }

        if (testrunReservation.getProfiles() != null) {
            this.profiles = testrunReservation.getProfiles().stream().map(TestrunProfileDTO::new).collect(Collectors.toList());
        }

        if (testrunReservation.getHooks() != null) {
            this.hooks = testrunReservation.getHooks().stream().map(TestrunHookDTO::new).collect(Collectors.toList());
        }
        if (testrunReservation.getMessageChannels() != null) {
            this.messageChannels = testrunReservation.getMessageChannels().stream().map(TestrunMessageChannelDTO::new).collect(Collectors.toList());
        }
    }


    public TestrunReservationDTO(TestrunReservation testrunReservation, boolean detail) {
        this(testrunReservation);
        if (detail) {
            if (testrunReservation.getTestrunUsers() != null) {
                testrunUsers = testrunReservation.getTestrunUsers().stream().map(TestrunUserDTO::new).collect(Collectors.toList());
            }

            if (testrunReservation.getTestcaseGroups() != null) {
                testcaseGroups = testrunReservation.getTestcaseGroups().stream().map(TestrunTestcaseGroupDTO::new).collect(Collectors.toList());
            }
        }
    }

}
