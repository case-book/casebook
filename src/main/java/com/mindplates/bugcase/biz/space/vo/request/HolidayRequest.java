package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.HolidayDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class HolidayRequest {

    private Long id;
    private Boolean isRegular;
    @NotBlank
    @Size(min = 1)
    private String date;
    @NotBlank
    @Size(min = 1)
    private String name;

    public HolidayDTO toDTO(SpaceDTO space) {
        return HolidayDTO.builder().id(id).space(space).isRegular(isRegular).date(date).name(name).build();
    }
}
