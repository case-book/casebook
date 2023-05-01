package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.common.code.TestrunIterationTimeTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunIterationDTO extends CommonDTO {

    private Long id;
    private String name;
    private String description;
    private List<TestrunUserDTO> testrunUsers;
    private List<TestrunTestcaseGroupDTO> testcaseGroups;
    private ProjectDTO project;
    private LocalDateTime reserveStartDateTime;
    private LocalDateTime reserveEndDateTime;
    private TestrunIterationTimeTypeCode testrunIterationTimeType;
    private Boolean excludeHoliday;
    private Integer durationHours;
    private Boolean expired;
    private String days;
    private LocalTime startTime;
    private Integer date;
    private Integer week;
    private Integer day;

    public TestrunIterationDTO(TestrunIteration testrunIteration) {
        this.id = testrunIteration.getId();
        this.name = testrunIteration.getName();
        this.description = testrunIteration.getDescription();
        if (testrunIteration.getProject() != null && testrunIteration.getProject().getSpace() != null) {
            this.project = ProjectDTO.builder().id(testrunIteration.getProject().getId()).space(SpaceDTO.builder().id(testrunIteration.getProject().getSpace().getId()).code(testrunIteration.getProject().getSpace().getCode()).build()).build();
        }

        if (testrunIteration.getProject() != null && testrunIteration.getProject().getSpace() == null) {
            this.project = ProjectDTO.builder().id(testrunIteration.getProject().getId()).build();
        }
        this.reserveStartDateTime = testrunIteration.getReserveStartDateTime();
        this.reserveEndDateTime = testrunIteration.getReserveEndDateTime();
        this.testrunIterationTimeType = testrunIteration.getTestrunIterationTimeType();
        this.excludeHoliday = testrunIteration.getExcludeHoliday();
        this.durationHours = testrunIteration.getDurationHours();
        this.expired = testrunIteration.getExpired();
        this.days = testrunIteration.getDays();
        this.startTime = testrunIteration.getStartTime();
        this.date = testrunIteration.getDate();
        this.week = testrunIteration.getWeek();
        this.day = testrunIteration.getDay();
    }

    public TestrunIterationDTO(TestrunIteration testrunIteration, boolean detail) {
        this(testrunIteration);
        if (detail) {
            testrunUsers = testrunIteration.getTestrunUsers().stream().map(TestrunUserDTO::new).collect(Collectors.toList());
            testcaseGroups = testrunIteration.getTestcaseGroups().stream().map(TestrunTestcaseGroupDTO::new).collect(Collectors.toList());
        }
    }

}
