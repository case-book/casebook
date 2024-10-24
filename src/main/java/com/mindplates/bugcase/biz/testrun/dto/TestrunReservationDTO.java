package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestrunReservationDTO extends CommonDTO implements IDTO<TestrunReservation> {

    private Long id;
    private String name;
    private String description;
    private ProjectDTO project;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private Boolean expired;
    private Boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private Boolean addConnectedSequenceTestcase;
    private Boolean assignSequenceTestcaseSameTester;
    private int testcaseGroupCount;
    private int testcaseCount;
    private TestrunDTO testrun;
    private Boolean selectCreatedTestcase;
    private Boolean selectUpdatedTestcase;
    private List<TestrunUserDTO> testrunUsers;
    private List<TestrunTestcaseGroupDTO> testcaseGroups;
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
        this.addConnectedSequenceTestcase = testrunReservation.getAddConnectedSequenceTestcase();
        this.assignSequenceTestcaseSameTester = testrunReservation.getAssignSequenceTestcaseSameTester();
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

    @Override
    public TestrunReservation toEntity() {
        TestrunReservation testrunReservation = TestrunReservation.builder()
            .id(id)
            .name(name)
            .description(description)
            .project(ProjectDTO.builder().id(project.getId()).build().toEntity())
            .startDateTime(startDateTime)
            .endDateTime(endDateTime)
            .expired(expired)
            .deadlineClose(deadlineClose)
            .autoTestcaseNotAssignedTester(autoTestcaseNotAssignedTester)
            .addConnectedSequenceTestcase(addConnectedSequenceTestcase)
            .assignSequenceTestcaseSameTester(assignSequenceTestcaseSameTester)
            .testcaseGroupCount(testcaseGroupCount)
            .testcaseCount(testcaseCount)
            .selectCreatedTestcase(selectCreatedTestcase)
            .selectUpdatedTestcase(selectUpdatedTestcase)
            .build();

        if (testrunUsers != null) {
            testrunReservation.setTestrunUsers(testrunUsers.stream().map(testrunUserDTO -> testrunUserDTO.toEntity(testrunReservation)).collect(Collectors.toList()));
        }

        if (profiles != null) {
            testrunReservation.setProfiles(profiles.stream().map(testrunProfileDTO -> testrunProfileDTO.toEntity(testrunReservation)).collect(Collectors.toList()));
        }

        if (hooks != null) {
            testrunReservation.setHooks(hooks.stream().map(testrunHookDTO -> testrunHookDTO.toEntity(testrunReservation)).collect(Collectors.toList()));
        }

        if (messageChannels != null) {
            testrunReservation.setMessageChannels(messageChannels.stream().map(testrunMessageChannelDTO -> testrunMessageChannelDTO.toEntity(testrunReservation)).collect(Collectors.toList()));
        }

        if (testcaseGroups != null) {
            testrunReservation.setTestcaseGroups(testcaseGroups.stream().map(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.toEntity(testrunReservation)).collect(Collectors.toList()));
        }

        return testrunReservation;
    }
}
