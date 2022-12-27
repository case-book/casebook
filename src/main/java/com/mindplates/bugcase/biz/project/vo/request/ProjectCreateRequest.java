package com.mindplates.bugcase.biz.project.vo.request;

import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseTemplateRequest;
import lombok.Data;

import java.util.List;

@Data
public class ProjectCreateRequest {

    private Long id;
    private String name;
    private String description;
    private String token;
    private Boolean activated;
    private List<TestcaseTemplateRequest> testcaseTemplates;
    private List<ProjectUserRequest> users;


}
