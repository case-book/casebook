package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceVariableDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class SpaceVariableCreateRequest implements IRequestVO<SpaceVariableDTO> {

    private Long id;
    @NotNull
    @Size(min = 1)
    private String name;
    public SpaceVariableDTO toDTO() {

        return SpaceVariableDTO
            .builder()
            .id(id)
            .name(name).build();
    }

}
