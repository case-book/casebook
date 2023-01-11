package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
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

    public TestrunTestcaseGroupTestcaseCommentDTO(TestrunTestcaseGroupTestcaseComment testrunTestcaseGroupTestcaseComment) {
        this.id = testrunTestcaseGroupTestcaseComment.getId();
        this.comment = testrunTestcaseGroupTestcaseComment.getComment();
        this.testrunTestcaseGroupTestcase = TestrunTestcaseGroupTestcaseDTO.builder().id(testrunTestcaseGroupTestcaseComment.getTestrunTestcaseGroupTestcase().getId()).build();
        this.creationDate = testrunTestcaseGroupTestcaseComment.getCreationDate();
        this.lastUpdateDate = testrunTestcaseGroupTestcaseComment.getLastUpdateDate();
        this.createdBy = testrunTestcaseGroupTestcaseComment.getCreatedBy();
        this.lastUpdatedBy = testrunTestcaseGroupTestcaseComment.getLastUpdatedBy();
    }


}
