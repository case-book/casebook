package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectFileDTO extends CommonDTO implements IDTO<ProjectFile> {

    private Long id;
    private ProjectDTO project;
    private String name;
    private String type;
    private String path;
    private Long size;
    private String uuid;
    private FileSourceTypeCode fileSourceType;
    private Long fileSourceId;
    private MultipartFile file;

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

    public ProjectFileDTO(long projectId, String name, Long size, String type, MultipartFile file) {
        this.project = ProjectDTO.builder().id(projectId).build();
        this.uuid = UUID.randomUUID().toString();
        this.name = name;
        this.size = size;
        this.type = type;
        this.file = file;
    }

    @Override
    public ProjectFile toEntity() {
        return ProjectFile.builder()
            .id(id)
            .project(Project.builder().id(this.project.getId()).build())
            .name(name)
            .type(type)
            .path(path)
            .size(size)
            .uuid(uuid)
            .fileSourceType(fileSourceType)
            .fileSourceId(fileSourceId)
            .build();
    }
}
