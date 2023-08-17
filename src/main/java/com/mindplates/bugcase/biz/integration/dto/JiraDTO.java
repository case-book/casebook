package com.mindplates.bugcase.biz.integration.dto;

import com.mindplates.bugcase.biz.integration.entity.Jira;
import com.mindplates.bugcase.biz.integration.entity.JiraType;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.util.EncryptUtil;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

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
    private JiraType type;

    public JiraDTO(Jira jira) {
        if (!Objects.isNull(jira)) {
            this.id = jira.getId();
            this.name = jira.getName();
            this.apiUrl = jira.getApiUrl();
            if (StringUtils.isNotEmpty(jira.getApiToken())) {
                this.apiToken = EncryptUtil
                    .maskString(jira.getApiToken(), Math.min(jira.getApiToken().length(), 5), jira.getApiToken().length(), '*');
            }
            this.space = new SpaceDTO(jira.getSpace());
            this.type = jira.getType();
        }
    }

}
