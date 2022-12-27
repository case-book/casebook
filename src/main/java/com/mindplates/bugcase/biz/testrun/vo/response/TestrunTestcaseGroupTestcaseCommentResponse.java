package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseCommentDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunTestcaseGroupTestcaseCommentResponse {

    private Long id;
    private Long testrunTestcaseGroupTestcaseId;
    private String comment;
    private Long userId;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public TestrunTestcaseGroupTestcaseCommentResponse(TestrunTestcaseGroupTestcaseCommentDTO testrunTestcaseGroupTestcaseComment) {
        this.id = testrunTestcaseGroupTestcaseComment.getId();
        this.testrunTestcaseGroupTestcaseId = testrunTestcaseGroupTestcaseComment.getTestrunTestcaseGroupTestcase().getId();
        this.comment = testrunTestcaseGroupTestcaseComment.getComment();
        this.userId = testrunTestcaseGroupTestcaseComment.getCreatedBy();
        this.creationDate = testrunTestcaseGroupTestcaseComment.getCreationDate();
        this.lastUpdateDate = testrunTestcaseGroupTestcaseComment.getLastUpdateDate();
    }


}
