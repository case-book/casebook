package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
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
public class TestrunTestcaseGroupDTO extends CommonDTO {

    private Long id;
    private TestrunDTO testrun;
    private TestcaseGroup testcaseGroup;
    private List<TestrunTestcaseGroupTestcaseDTO> testcases;

}
