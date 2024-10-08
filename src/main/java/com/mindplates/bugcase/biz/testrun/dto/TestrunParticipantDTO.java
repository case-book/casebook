package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunParticipant;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestrunParticipantDTO extends CommonDTO {

    private String id;
    private String spaceCode;
    private Long projectId;
    private Long testrunId;
    private String sessionId;
    private Long userId;
    private String userEmail;
    private String userName;
    private Long count;

    public TestrunParticipantDTO(TestrunParticipant testrunParticipant) {
        this.id = testrunParticipant.getId();
        this.spaceCode = testrunParticipant.getSpaceCode();
        this.projectId = testrunParticipant.getProjectId();
        this.sessionId = testrunParticipant.getSessionId();
        this.testrunId = testrunParticipant.getTestrunId();
        this.userId = testrunParticipant.getUserId();
        this.userEmail = testrunParticipant.getUserEmail();
        this.userName = testrunParticipant.getUserName();
        this.count = testrunParticipant.getCount();
    }


}
