package com.mindplates.bugcase.biz.integration.vo.request;

import com.mindplates.bugcase.biz.integration.dto.JiraDTO;
import com.mindplates.bugcase.biz.integration.entity.JiraType;
import lombok.Data;

@Data
public class JiraUpdateRequest {

    private Long id;
    private String name;
    private String apiUrl;
    private String apiToken;
    private JiraType type;

    public JiraDTO toDTO() {
        return JiraDTO.builder()
            .id(this.id)
            .name(this.name)
            .apiUrl(this.apiUrl)
            .apiToken(this.apiToken)
            .type(this.type)
            .build();
    }

}
