package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseTemplateDTO extends CommonDTO {

    private Long id;
    private String name;
    private boolean defaultTemplate;
    private String defaultTesterType;
    private String defaultTesterValue;
    private ProjectDTO project;
    private List<TestcaseTemplateItemDTO> testcaseTemplateItems;
    private String crud;


}
