package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SpaceProfileCreateRequest implements IRequestVO<SpaceProfileDTO> {

    private Long id;
    @NotNull
    @Size(min = 1)
    private String name;
    private boolean isDefault;

    public SpaceProfileDTO toDTO() {

        return SpaceProfileDTO
            .builder()
            .id(id)
            .isDefault(isDefault)
            .name(name)
            .build();
    }

}
