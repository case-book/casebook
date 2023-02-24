package com.mindplates.bugcase.biz.space.dto;


import com.mindplates.bugcase.biz.space.entity.Holiday;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HolidayDTO extends CommonEntity {

    Long id;
    private SpaceDTO space;
    private Boolean isRegular;
    private String date;
    private String name;

    public HolidayDTO(Holiday holiday) {
        this.id = holiday.getId();
        this.space = SpaceDTO.builder().id(holiday.getSpace().getId()).build();
        this.isRegular = holiday.getIsRegular();
        this.date = holiday.getDate();
        this.name = holiday.getName();
    }

}
