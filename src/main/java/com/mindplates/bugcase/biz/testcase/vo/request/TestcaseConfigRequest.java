package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class TestcaseConfigRequest {

    private List<TestcaseTemplateRequest> testcaseTemplates;

    public List<TestcaseTemplate> buildEntity(Long projectId) {
        return testcaseTemplates.stream().map((testcaseTemplateRequest -> {
            TestcaseTemplate testcaseTemplate = testcaseTemplateRequest.buildEntity();
            testcaseTemplate.setProject(Project.builder().id(projectId).build());
            return testcaseTemplate;
        })).collect(Collectors.toList());
    }


}
