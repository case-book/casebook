package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseItemDTO extends CommonDTO {

    private Long id;
    private TestcaseTemplateItemDTO testcaseTemplateItem;
    private TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase;
    private String type;
    private String value;
    private String text;

}
