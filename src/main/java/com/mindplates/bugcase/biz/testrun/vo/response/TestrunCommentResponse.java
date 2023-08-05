package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunCommentDTO;
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
public class TestrunCommentResponse {

    private Long id;
    private Long testrunId;
    private String comment;
    private SimpleUserResponse user;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public TestrunCommentResponse(TestrunCommentDTO testrunCommentDTO) {
        this.id = testrunCommentDTO.getId();
        this.testrunId = testrunCommentDTO.getTestrun().getId();
        this.comment = testrunCommentDTO.getComment();
        if (testrunCommentDTO.getUser() != null) {
            this.user = SimpleUserResponse.builder().id(testrunCommentDTO.getUser().getId()).name(testrunCommentDTO.getUser().getName()).email(testrunCommentDTO.getUser().getEmail()).build();
        }
        this.creationDate = testrunCommentDTO.getCreationDate();
        this.lastUpdateDate = testrunCommentDTO.getLastUpdateDate();
    }


}
