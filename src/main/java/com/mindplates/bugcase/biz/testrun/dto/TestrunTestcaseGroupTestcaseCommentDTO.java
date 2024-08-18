package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseComment;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseCommentDTO extends CommonDTO implements IDTO<TestrunTestcaseGroupTestcaseComment> {

    private Long id;
    private TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase;
    private String comment;
    private UserDTO user;

    public TestrunTestcaseGroupTestcaseCommentDTO(TestrunTestcaseGroupTestcaseComment testrunTestcaseGroupTestcaseComment) {
        this.id = testrunTestcaseGroupTestcaseComment.getId();
        this.comment = testrunTestcaseGroupTestcaseComment.getComment();
        this.testrunTestcaseGroupTestcase = TestrunTestcaseGroupTestcaseDTO.builder().id(testrunTestcaseGroupTestcaseComment.getTestrunTestcaseGroupTestcase().getId()).build();
        if (testrunTestcaseGroupTestcaseComment.getUser() != null) {
            this.user = UserDTO.builder()
                .id(testrunTestcaseGroupTestcaseComment.getUser().getId())
                .name(testrunTestcaseGroupTestcaseComment.getUser().getName())
                .email(testrunTestcaseGroupTestcaseComment.getUser().getEmail())
                .avatarInfo(testrunTestcaseGroupTestcaseComment.getUser().getAvatarInfo())
                .build();
        }
        this.creationDate = testrunTestcaseGroupTestcaseComment.getCreationDate();
        this.lastUpdateDate = testrunTestcaseGroupTestcaseComment.getLastUpdateDate();
        this.createdBy = testrunTestcaseGroupTestcaseComment.getCreatedBy();
        this.lastUpdatedBy = testrunTestcaseGroupTestcaseComment.getLastUpdatedBy();
    }


    @Override
    public TestrunTestcaseGroupTestcaseComment toEntity() {
        return TestrunTestcaseGroupTestcaseComment.builder()
            .id(id)
            .comment(comment)
            .testrunTestcaseGroupTestcase(TestrunTestcaseGroupTestcase.builder().id(testrunTestcaseGroupTestcase.getId()).build())
            .user(User.builder().id(user.getId()).build())
            .build();
    }

    public TestrunTestcaseGroupTestcaseComment toEntity(User user) {
        return TestrunTestcaseGroupTestcaseComment.builder()
            .id(id)
            .comment(comment)
            .testrunTestcaseGroupTestcase(TestrunTestcaseGroupTestcase.builder().id(testrunTestcaseGroupTestcase.getId()).build())
            .user(user)
            .build();
    }
}
