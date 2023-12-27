package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceProfileVariableDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceVariableDTO;
import java.time.LocalDateTime;
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
public class SpaceProfileVariableResponse {

    private Long id;
    private String value;
    private SpaceVariableDTO spaceVariable;
    private SpaceProfileDTO spaceProfile;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public SpaceProfileVariableResponse(SpaceProfileVariableDTO spaceProfileVariable) {
        this.id = spaceProfileVariable.getId();
        this.value = spaceProfileVariable.getValue();
        this.spaceVariable = spaceProfileVariable.getSpaceVariable();
        this.spaceProfile = spaceProfileVariable.getSpaceProfile();
        this.creationDate = spaceProfileVariable.getCreationDate();
        this.lastUpdateDate = spaceProfileVariable.getLastUpdateDate();
    }

}
