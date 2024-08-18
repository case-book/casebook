package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunComment;
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
public class TestrunCommentDTO extends CommonDTO implements IDTO<TestrunComment> {

    private Long id;
    private TestrunDTO testrun;
    private String comment;
    private UserDTO user;

    public TestrunCommentDTO(TestrunComment testrunComment) {
        this.id = testrunComment.getId();
        this.comment = testrunComment.getComment();
        this.testrun = TestrunDTO.builder().id(testrunComment.getTestrun().getId()).build();
        if (testrunComment.getUser() != null) {
            this.user = UserDTO.builder().id(testrunComment.getUser().getId()).name(testrunComment.getUser().getName()).email(testrunComment.getUser().getEmail())
                .avatarInfo(testrunComment.getUser().getAvatarInfo()).build();
        }
        this.creationDate = testrunComment.getCreationDate();
        this.lastUpdateDate = testrunComment.getLastUpdateDate();
        this.createdBy = testrunComment.getCreatedBy();
        this.lastUpdatedBy = testrunComment.getLastUpdatedBy();
    }


    @Override
    public TestrunComment toEntity() {
        TestrunComment testrunComment = TestrunComment.builder()
            .id(this.id)
            .comment(this.comment)
            .build();

        if (this.testrun != null) {
            testrunComment.setTestrun(Testrun.builder().id(this.testrun.getId()).build());
        }

        if (this.user != null) {
            testrunComment.setUser(User.builder().id(this.user.getId()).build());
        }

        return testrunComment;
    }

    public TestrunComment toEntity(long testrunId, long userId) {
        TestrunComment testrunComment = toEntity();
        testrunComment.setTestrun(Testrun.builder().id(testrunId).build());
        testrunComment.setUser(User.builder().id(userId).build());
        return testrunComment;
    }
}
