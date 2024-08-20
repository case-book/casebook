package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.HolidayDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.common.code.HolidayTypeCode;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HolidayRequest {

    private Long id;
    private HolidayTypeCode holidayType;
    private String date;
    private Integer month;
    private Integer week;
    private Integer day;
    @NotBlank
    @Size(min = 1)
    private String name;


    public HolidayDTO toDTO(SpaceDTO space) {
        return HolidayDTO.builder().id(id).space(space).holidayType(holidayType).month(month).week(week).day(day).date(date).name(name).build();
    }
}
