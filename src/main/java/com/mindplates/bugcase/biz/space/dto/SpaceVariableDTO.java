package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceVariable;
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
public class SpaceVariableDTO extends CommonDTO implements IDTO<SpaceVariable> {

    private Long id;
    private String name;
    private SpaceDTO space;
    private boolean isDefault;

    public SpaceVariableDTO(SpaceVariable spaceVariable) {
        this.id = spaceVariable.getId();
        this.name = spaceVariable.getName();
        this.space = SpaceDTO.builder().id(spaceVariable.getSpace().getId()).build();
    }


    @Override
    public SpaceVariable toEntity() {
        return SpaceVariable.builder().id(id).name(name).space(Space.builder().id(space.getId()).build()).build();
    }
}
