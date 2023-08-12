package com.mindplates.bugcase.biz.integration.vo.response;

import com.mindplates.bugcase.biz.integration.dto.JiraAgileBoardDTO;
import lombok.Data;

@Data
public class JiraAgileBoardResponse {

    private long id;
    private String name;
    private String type;

    public JiraAgileBoardResponse(JiraAgileBoardDTO jiraAgileBoardDTO) {
        this.id = jiraAgileBoardDTO.getId();
        this.name = jiraAgileBoardDTO.getName();
        this.type = jiraAgileBoardDTO.getType();
    }

}
