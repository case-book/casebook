package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunParticipant;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunParticipantDTO {

    private String id;
    private String spaceCode;
    private Long projectId;
    private Long testrunId;
    private Long userId;
    private String userEmail;
    private String userName;
    private Long count;

    public TestrunParticipantDTO(TestrunParticipant testrunParticipant) {
        this.id = testrunParticipant.getId();
        this.spaceCode = testrunParticipant.getSpaceCode();
        this.projectId = testrunParticipant.getProjectId();
        this.testrunId = testrunParticipant.getTestrunId();
        this.userId = testrunParticipant.getUserId();
        this.userEmail = testrunParticipant.getUserEmail();
        this.userName = testrunParticipant.getUserName();
        this.count = testrunParticipant.getCount();
    }


}
