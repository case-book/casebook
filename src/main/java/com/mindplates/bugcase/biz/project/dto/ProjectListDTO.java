package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class ProjectListDTO extends CommonDTO {

    private Long id;
    private String name;
    private String description;
    private boolean activated;
    private String token;
    private Integer testcaseGroupSeq = 0;
    private Integer testcaseSeq = 0;
    private Integer testrunSeq = 0;
    private Long testrunCount = 0L;
    private Long testcaseCount = 0L;
    private boolean aiEnabled;
    private SpaceDTO space;

    public ProjectListDTO(Project project) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.activated = project.isActivated();
        this.token = project.getToken();
        this.creationDate = project.getCreationDate();
        this.testcaseGroupSeq = project.getTestcaseGroupSeq();
        this.testcaseSeq = project.getTestcaseSeq();
        this.testrunSeq = project.getTestrunSeq();
        this.aiEnabled = project.isAiEnabled();
        this.testrunCount = project.getTestrunCount();
        this.testcaseCount = project.getTestcaseCount();

        if (project.getSpace() != null) {
            this.space = SpaceDTO.builder().id(project.getSpace().getId()).build();
        }


    }


}
