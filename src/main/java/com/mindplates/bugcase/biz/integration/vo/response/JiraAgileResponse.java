package com.mindplates.bugcase.biz.integration.vo.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.mindplates.bugcase.biz.integration.dto.JiraAgileResponseDTO;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class JiraAgileResponse<T> {

    private String next;
    private String previous;
    private Integer maxResults;
    private Integer startAt;
    private Integer total;
    private Boolean isLast;
    private T values;

    public JiraAgileResponse(JiraAgileResponseDTO jiraAgileDTO, T values) {
        this.next = jiraAgileDTO.getNext();
        this.previous = jiraAgileDTO.getPrevious();
        this.maxResults = jiraAgileDTO.getMaxResults();
        this.startAt = jiraAgileDTO.getStartAt();
        this.total = jiraAgileDTO.getTotal();
        this.isLast = jiraAgileDTO.getIsLast();
        this.values = values;
    }

}
