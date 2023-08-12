package com.mindplates.bugcase.biz.integration.dto;

import lombok.Data;

@Data
public class JiraAgileResponseDTO {

    private String next;
    private String previous;
    private Integer maxResults;
    private Integer startAt;
    private Integer total;
    private Boolean isLast;

}
