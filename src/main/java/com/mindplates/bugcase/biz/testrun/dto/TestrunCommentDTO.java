package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunComment;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunCommentDTO extends CommonDTO {

    private Long id;
    private TestrunDTO testrun;
    private String comment;
    private UserDTO user;

    public TestrunCommentDTO(TestrunComment testrunComment) {
        this.id = testrunComment.getId();
        this.comment = testrunComment.getComment();
        this.testrun = TestrunDTO.builder().id(testrunComment.getTestrun().getId()).build();
        if (testrunComment.getUser() != null) {
            this.user = UserDTO.builder().id(testrunComment.getUser().getId()).name(testrunComment.getUser().getName()).email(testrunComment.getUser().getEmail()).build();
        }
        this.creationDate = testrunComment.getCreationDate();
        this.lastUpdateDate = testrunComment.getLastUpdateDate();
        this.createdBy = testrunComment.getCreatedBy();
        this.lastUpdatedBy = testrunComment.getLastUpdatedBy();
    }


}
