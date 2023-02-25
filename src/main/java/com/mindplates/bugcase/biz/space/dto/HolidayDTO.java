package com.mindplates.bugcase.biz.space.dto;


import com.mindplates.bugcase.biz.space.entity.Holiday;
import com.mindplates.bugcase.common.code.HolidayTypeCode;
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
    private HolidayTypeCode holidayType;
    private SpaceDTO space;
    private String date;
    private Integer month;
    private Integer week;
    private Integer day;
    private String name;
    private Boolean isRegular;

    public HolidayDTO(Holiday holiday) {
        this.id = holiday.getId();
        this.space = SpaceDTO.builder().id(holiday.getSpace().getId()).build();
        this.month = holiday.getMonth();
        this.holidayType = holiday.getHolidayType();
        this.week = holiday.getWeek();
        this.day = holiday.getDay();
        this.date = holiday.getDate();
        this.name = holiday.getName();
        this.isRegular = holiday.getIsRegular();
    }

}
