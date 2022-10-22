package com.mindplates.bugcase.biz.testcase.vo.request;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import lombok.Data;

@Data
public class TestcaseGroupRequest {

  private Long id;
  private Long parentId;
  private Long depth;
  private String name;
  private Integer itemOrder;

  public TestcaseGroup buildEntity(Long projectId) {
    return TestcaseGroup.builder()
        .id(id)
        .parentId(parentId)
        .depth(depth)
        .name(name)
        .itemOrder(itemOrder)
        .project(Project.builder().id(projectId).build())
        .build();
  }
}
