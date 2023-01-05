package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseGroupDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
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
public class ProjectDTO extends CommonDTO {

    private Long id;
    private String name;
    private String description;
    private boolean activated;
    private String token;
    private List<TestcaseGroupDTO> testcaseGroups;
    private List<TestrunDTO> testruns;
    private List<TestcaseTemplateDTO> testcaseTemplates;
    private List<ProjectUserDTO> users;
    private List<ProjectApplicantDTO> applicants;
    private SpaceDTO space;
    private Integer testcaseGroupSeq = 0;
    private Integer testcaseSeq = 0;
    private Integer testrunSeq = 0;

}
