package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
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
public class SpaceProfileDTO extends CommonDTO implements IDTO<SpaceProfile> {

    private Long id;
    private String name;
    private SpaceDTO space;
    private boolean isDefault;

    public SpaceProfileDTO(SpaceProfile spaceProfile) {
        this.id = spaceProfile.getId();
        this.name = spaceProfile.getName();
        this.space = SpaceDTO.builder().id(spaceProfile.getSpace().getId()).build();
        this.isDefault = spaceProfile.isDefault();
    }

    @Override
    public SpaceProfile toEntity() {
        return SpaceProfile.builder()
            .id(id)
            .name(name)
            .space(Space.builder().id(space.getId()).build())
            .isDefault(isDefault)
            .build();
    }
}
