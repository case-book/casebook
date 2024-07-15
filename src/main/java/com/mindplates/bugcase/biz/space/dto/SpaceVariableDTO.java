package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceVariable;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SpaceVariableDTO extends CommonDTO {

    private Long id;
    private String name;
    private SpaceDTO space;
    private boolean isDefault;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public SpaceVariableDTO(SpaceVariable spaceVariable) {
        this.id = spaceVariable.getId();
        this.name = spaceVariable.getName();
        this.space = SpaceDTO.builder().id(spaceVariable.getSpace().getId()).build();
        this.creationDate = spaceVariable.getCreationDate();
        this.lastUpdateDate = spaceVariable.getLastUpdateDate();
    }


}
