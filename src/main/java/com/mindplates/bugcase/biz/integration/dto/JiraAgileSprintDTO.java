package com.mindplates.bugcase.biz.integration.dto;

import lombok.Data;

@Data
public class JiraAgileSprintDTO {

    private long id;
    private String name;
    private String state;
    private String startDate;
    private String endDate;
    private String completeDate;
    private long originBoardId;
    private String goal;

}
