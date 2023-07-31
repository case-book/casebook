package com.mindplates.bugcase.biz.integration.dto;

import com.mindplates.bugcase.biz.integration.entity.Jira;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class JiraDTO extends CommonDTO {

    private Long id;
    private String name;
    private String apiUrl;
    private String apiToken;
    private SpaceDTO space;

    public JiraDTO(Jira jira) {
        if (!Objects.isNull(jira)) {
            this.id = jira.getId();
            this.name = jira.getName();
            this.apiUrl = jira.getApiUrl();
            this.apiToken = jira.getApiToken();
            this.space = new SpaceDTO(jira.getSpace());
        }
    }

}
