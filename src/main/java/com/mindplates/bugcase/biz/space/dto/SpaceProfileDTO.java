package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
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
public class SpaceProfileDTO extends CommonDTO {

    private Long id;
    private String name;
    private SpaceDTO space;
    private boolean isDefault;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public SpaceProfileDTO(SpaceProfile spaceProfile) {
        this.id = spaceProfile.getId();
        this.name = spaceProfile.getName();
        this.space = SpaceDTO.builder().id(spaceProfile.getSpace().getId()).build();
        this.isDefault = spaceProfile.isDefault();
        this.creationDate = spaceProfile.getCreationDate();
        this.lastUpdateDate = spaceProfile.getLastUpdateDate();
    }


}
