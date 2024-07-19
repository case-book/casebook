package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunDTO extends CommonDTO implements IDTO<Testrun> {

    private Long id;
    private String seqId;
    private String name;
    private String description;
    private ProjectDTO project;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private boolean opened;
    private int totalTestcaseCount;
    private int passedTestcaseCount;
    private int failedTestcaseCount;
    private int untestableTestcaseCount;
    private LocalDateTime closedDate;
    private String days;
    private Boolean excludeHoliday;
    private LocalTime startTime;
    private Integer durationHours;
    private Boolean reserveExpired;
    private Long reserveResultId;
    private Boolean deadlineClose;
    private Boolean autoTestcaseNotAssignedTester;
    private List<TestrunUserDTO> testrunUsers;
    private List<TestrunTestcaseGroupDTO> testcaseGroups;
    private List<TestrunProfileDTO> profiles;
    private List<TestrunHookDTO> hooks;
    private List<TestrunMessageChannelDTO> messageChannels;

    public TestrunDTO(Testrun testrun) {
        this.id = testrun.getId();
        this.seqId = testrun.getSeqId();
        this.name = testrun.getName();
        this.description = testrun.getDescription();
        this.startDateTime = testrun.getStartDateTime();
        this.endDateTime = testrun.getEndDateTime();
        this.opened = testrun.isOpened();
        this.totalTestcaseCount = testrun.getTotalTestcaseCount();
        this.passedTestcaseCount = testrun.getPassedTestcaseCount();
        this.failedTestcaseCount = testrun.getFailedTestcaseCount();
        this.untestableTestcaseCount = testrun.getUntestableTestcaseCount();
        this.closedDate = testrun.getClosedDate();
        if (testrun.getProject() != null) {
            this.project = ProjectDTO.builder().id(testrun.getProject().getId()).build();
        }
        this.days = testrun.getDays();
        this.excludeHoliday = testrun.getExcludeHoliday();
        this.startTime = testrun.getStartTime();
        this.durationHours = testrun.getDurationHours();
        this.reserveExpired = testrun.getReserveExpired();
        this.reserveResultId = testrun.getReserveResultId();
        this.deadlineClose = testrun.getDeadlineClose();
        this.autoTestcaseNotAssignedTester = testrun.getAutoTestcaseNotAssignedTester();
        this.profiles = testrun.getProfiles().stream().map(TestrunProfileDTO::new).collect(Collectors.toList());
        if (testrun.getHooks() != null) {
            this.hooks = testrun.getHooks().stream().map(TestrunHookDTO::new).collect(Collectors.toList());
        }
        if (testrun.getMessageChannels() != null) {
            this.messageChannels = testrun.getMessageChannels().stream().map(TestrunMessageChannelDTO::new).collect(Collectors.toList());
        }
    }

    public TestrunDTO(Testrun testrun, boolean detail) {
        this(testrun);
        if (detail) {
            testrunUsers = testrun.getTestrunUsers().stream().map(TestrunUserDTO::new).collect(Collectors.toList());
            testcaseGroups = testrun.getTestcaseGroups().stream().map(TestrunTestcaseGroupDTO::new).collect(Collectors.toList());
        }
    }

    public List<TestrunHookDTO> getTestrunHookList(TestrunHookTiming timing) {
        return this.hooks.stream().filter(hook -> hook.getTiming().equals(timing)).collect(Collectors.toList());
    }

    @Override
    public Testrun toEntity() {
        Testrun testrun = Testrun.builder()
            .id(id)
            .seqId(seqId)
            .name(name)
            .description(description)
            .project(Project.builder().id(project.getId()).build())
            .startDateTime(startDateTime)
            .endDateTime(endDateTime)
            .opened(opened)
            .totalTestcaseCount(totalTestcaseCount)
            .passedTestcaseCount(passedTestcaseCount)
            .failedTestcaseCount(failedTestcaseCount)
            .untestableTestcaseCount(untestableTestcaseCount)
            .closedDate(closedDate)
            .days(days)
            .excludeHoliday(excludeHoliday)
            .startTime(startTime)
            .durationHours(durationHours)
            .reserveExpired(reserveExpired)
            .reserveResultId(reserveResultId)
            .deadlineClose(deadlineClose)
            .autoTestcaseNotAssignedTester(autoTestcaseNotAssignedTester)



            .build();

        if (testrunUsers != null) {
            testrun.setTestrunUsers(testrunUsers.stream().map(testrunUserDTO -> testrunUserDTO.toEntity(testrun)).collect(Collectors.toList()));
        }

        if (profiles != null) {
            testrun.setProfiles(profiles.stream().map(testrunProfileDTO -> testrunProfileDTO.toEntity(testrun)).collect(Collectors.toList()));
        }

        if (hooks != null) {
            testrun.setHooks(hooks.stream().map(testrunHookDTO -> testrunHookDTO.toEntity(testrun)).collect(Collectors.toList()));
        }

        if (messageChannels != null) {
            testrun.setMessageChannels(messageChannels.stream().map(testrunMessageChannelDTO -> testrunMessageChannelDTO.toEntity(testrun)).collect(Collectors.toList()));
        }

        if (testcaseGroups != null) {
            testrun.setTestcaseGroups(testcaseGroups.stream().map(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.toEntity(testrun)).collect(Collectors.toList()));
        }

        return testrun;

    }

    public Testrun toEntity(Project project) {
        Testrun testrun = toEntity();
        testrun.setProject(project);
        return testrun;
    }
}
