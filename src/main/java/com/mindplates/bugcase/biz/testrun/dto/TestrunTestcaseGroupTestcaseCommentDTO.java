package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseCommentDTO extends CommonDTO {

    private Long id;
    private TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase;
    private String comment;


}
