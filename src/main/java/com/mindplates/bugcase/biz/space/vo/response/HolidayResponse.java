package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.HolidayDTO;
import com.mindplates.bugcase.common.code.HolidayTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HolidayResponse {

    private Long id;
    private HolidayTypeCode holidayType;
    private Long spaceId;
    private String date;
    private Integer month;
    private Integer week;
    private Integer day;
    private String name;


    public HolidayResponse(HolidayDTO holiday) {
        this.id = holiday.getId();
        this.holidayType = holiday.getHolidayType();
        this.spaceId = holiday.getSpace().getId();
        this.date = holiday.getDate();
        this.month = holiday.getMonth();
        this.week = holiday.getWeek();
        this.day = holiday.getDay();
        this.name = holiday.getName();

    }
}
