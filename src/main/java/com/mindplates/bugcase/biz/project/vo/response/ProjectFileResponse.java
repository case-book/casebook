package com.mindplates.bugcase.biz.project.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectFileResponse {

    private Long id;
    private String name;
    private String type;
    private String path;
    private Long size;
    private String spaceCode;
    private Long projectId;


    private String uuid;

    public ProjectFileResponse(ProjectFileDTO projectFile, String spaceCode, Long projectId) {
        this.id = projectFile.getId();
        this.name = projectFile.getName();
        this.type = projectFile.getType();
        this.path = projectFile.getPath();
        this.size = projectFile.getSize();
        this.spaceCode = spaceCode;
        this.projectId = projectId;

        this.uuid = projectFile.getUuid();

    }
}
