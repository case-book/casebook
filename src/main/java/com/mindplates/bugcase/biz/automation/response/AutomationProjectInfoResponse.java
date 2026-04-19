package com.mindplates.bugcase.biz.automation.response;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AutomationProjectInfoResponse {

    private Long id;
    private String name;
    private String description;
    private String token;
    private Boolean activated;
    private String spaceName;
    private String spaceCode;
    private Long defaultTestcaseTemplateId;
    private boolean aiEnabled;
    private LocalDateTime creationDate;

    public AutomationProjectInfoResponse(ProjectDTO project, String spaceCode) {
        this.id = project.getId();
        this.name = project.getName();
        this.description = project.getDescription();
        this.token = project.getToken();
        this.activated = project.isActivated();
        this.spaceCode = spaceCode;
        if (project.getSpace() != null) {
            this.spaceName = project.getSpace().getName();
        }
        this.aiEnabled = project.isAiEnabled();
        this.creationDate = project.getCreationDate();
        if (project.getTestcaseTemplates() != null) {
            this.defaultTestcaseTemplateId = project.getTestcaseTemplates().stream()
                .filter(TestcaseTemplateDTO::isDefaultTemplate)
                .map(TestcaseTemplateDTO::getId)
                .findFirst()
                .orElse(null);
        }
    }
}
