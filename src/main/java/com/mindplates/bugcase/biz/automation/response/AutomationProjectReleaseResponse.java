package com.mindplates.bugcase.biz.automation.response;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AutomationProjectReleaseResponse {

    private Long id;
    private String name;
    private Boolean isTarget;
    private String description;

    public AutomationProjectReleaseResponse(ProjectReleaseDTO release) {
        this.id = release.getId();
        this.name = release.getName();
        this.isTarget = release.getIsTarget();
        this.description = release.getDescription();
    }
}
