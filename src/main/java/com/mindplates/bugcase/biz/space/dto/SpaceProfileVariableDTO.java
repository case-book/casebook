package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceProfileVariable;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.time.LocalDateTime;
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
public class SpaceProfileVariableDTO extends CommonDTO {

    private Long id;
    private String value;
    private SpaceVariableDTO spaceVariable;
    private SpaceProfileDTO spaceProfile;
    private SpaceDTO space;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public SpaceProfileVariableDTO(SpaceProfileVariable spaceProfileVariable) {
        this.id = spaceProfileVariable.getId();
        this.value = spaceProfileVariable.getValue();
        this.spaceVariable = SpaceVariableDTO.builder().id(spaceProfileVariable.getSpaceVariable().getId()).build();
        this.spaceProfile = SpaceProfileDTO.builder().id(spaceProfileVariable.getSpaceProfile().getId()).build();
        this.space = SpaceDTO.builder().id(spaceProfileVariable.getSpace().getId()).build();
        this.creationDate = spaceProfileVariable.getCreationDate();
        this.lastUpdateDate = spaceProfileVariable.getLastUpdateDate();
    }


}
