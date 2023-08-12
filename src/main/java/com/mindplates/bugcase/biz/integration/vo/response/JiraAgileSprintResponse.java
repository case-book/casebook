package com.mindplates.bugcase.biz.integration.vo.response;

import com.mindplates.bugcase.biz.integration.dto.JiraAgileSprintDTO;
import lombok.Data;

@Data
public class JiraAgileSprintResponse {

    private long id;
    private String name;
    private String state;
    private String startDate;
    private String endDate;
    private String completeDate;
    private long originBoardId;
    private String goal;

    public JiraAgileSprintResponse(JiraAgileSprintDTO jiraAgileSprintDTO) {
        this.id = jiraAgileSprintDTO.getId();
        this.name = jiraAgileSprintDTO.getName();
        this.state = jiraAgileSprintDTO.getState();
        this.startDate = jiraAgileSprintDTO.getStartDate();
        this.endDate = jiraAgileSprintDTO.getEndDate();
        this.completeDate = jiraAgileSprintDTO.getCompleteDate();
        this.originBoardId = jiraAgileSprintDTO.getOriginBoardId();
        this.goal = jiraAgileSprintDTO.getGoal();
    }

}
