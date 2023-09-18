package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseCommentDTO;
import com.mindplates.bugcase.biz.user.vo.response.SimpleUserResponse;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunTestcaseGroupTestcaseCommentResponse {

    private Long id;
    private Long testrunTestcaseGroupTestcaseId;
    private String comment;
    private SimpleUserResponse user;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public TestrunTestcaseGroupTestcaseCommentResponse(TestrunTestcaseGroupTestcaseCommentDTO testrunTestcaseGroupTestcaseComment) {
        this.id = testrunTestcaseGroupTestcaseComment.getId();
        this.testrunTestcaseGroupTestcaseId = testrunTestcaseGroupTestcaseComment.getTestrunTestcaseGroupTestcase().getId();
        this.comment = testrunTestcaseGroupTestcaseComment.getComment();
        if (testrunTestcaseGroupTestcaseComment.getUser() != null) {
            this.user = SimpleUserResponse.builder().id(testrunTestcaseGroupTestcaseComment.getUser().getId())
                .name(testrunTestcaseGroupTestcaseComment.getUser().getName()).email(testrunTestcaseGroupTestcaseComment.getUser().getEmail())
                .avatarInfo(testrunTestcaseGroupTestcaseComment.getUser().getAvatarInfo()).build();
        }
        this.creationDate = testrunTestcaseGroupTestcaseComment.getCreationDate();
        this.lastUpdateDate = testrunTestcaseGroupTestcaseComment.getLastUpdateDate();
    }


}
