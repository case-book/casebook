package com.mindplates.bugcase.biz.space.vo.response;

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
public class SpaceVariableResponse {

    private Long id;
    private String name;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public SpaceVariableResponse(SpaceVariableDTO spaceVariable) {
        this.id = spaceVariable.getId();
        this.name = spaceVariable.getName();
        this.creationDate = spaceVariable.getCreationDate();
        this.lastUpdateDate = spaceVariable.getLastUpdateDate();
    }

}
