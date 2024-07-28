package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpaceApplicantResponse {

    private Long id;
    private ApprovalStatusCode approvalStatusCode;

    private String message;
    private Long userId;
    private String userEmail;
    private String userName;

    public SpaceApplicantResponse(SpaceApplicantDTO spaceApplicant) {
        this.id = spaceApplicant.getId();
        this.approvalStatusCode = spaceApplicant.getApprovalStatusCode();
        this.userId = spaceApplicant.getUser().getId();
        this.message = spaceApplicant.getMessage();
        if (spaceApplicant.getUser().getEmail() != null) {
            this.userEmail = spaceApplicant.getUser().getEmail();
        }
        if (spaceApplicant.getUser().getName() != null) {
            this.userName = spaceApplicant.getUser().getName();
        }

    }
}
