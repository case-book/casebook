package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileVariableDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class SpaceProfileVariableRequest implements IRequestVO<SpaceProfileVariableDTO> {

    private Long id;
    @NotNull
    @Size(min = 1)
    private String value;
    private boolean isDefault;

    public SpaceProfileVariableDTO toDTO() {
        return SpaceProfileVariableDTO
            .builder()
            .id(id)
            .value(value)
            .build();
    }

}
