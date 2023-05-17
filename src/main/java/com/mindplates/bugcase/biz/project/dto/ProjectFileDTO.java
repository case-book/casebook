package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectFileDTO extends CommonDTO {

    private Long id;
    private ProjectDTO project;
    private String name;
    private String type;
    private String path;
    private Long size;
    private String uuid;
    private FileSourceTypeCode fileSourceType;
    private Long fileSourceId;

    public ProjectFileDTO(ProjectFile projectFile) {
        this.id = projectFile.getId();
        this.name = projectFile.getName();
        this.project = ProjectDTO.builder().id(projectFile.getProject().getId()).build();
        this.type = projectFile.getType();
        this.path = projectFile.getPath();
        this.size = projectFile.getSize();
        this.uuid = projectFile.getUuid();
        this.fileSourceType = projectFile.getFileSourceType();
        this.fileSourceId = projectFile.getFileSourceId();
    }
}
