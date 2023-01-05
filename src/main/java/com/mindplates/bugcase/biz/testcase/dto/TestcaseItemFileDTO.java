package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseItemFileDTO extends CommonDTO {

    private Long id;
    private ProjectDTO project;
    private TestcaseDTO testcase;
    private String name;
    private String type;
    private String path;
    private Long size;
    private String uuid;


}
