package com.mindplates.bugcase.biz.space.dto;


import com.mindplates.bugcase.biz.space.entity.Holiday;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.code.HolidayTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class HolidayDTO extends CommonDTO implements IDTO<Holiday> {

    Long id;
    private HolidayTypeCode holidayType;
    private SpaceDTO space;
    private String date;
    private Integer month;
    private Integer week;
    private Integer day;
    private String name;

    public HolidayDTO(Holiday holiday) {
        this.id = holiday.getId();
        this.space = SpaceDTO.builder().id(holiday.getSpace().getId()).build();
        this.month = holiday.getMonth();
        this.holidayType = holiday.getHolidayType();
        this.week = holiday.getWeek();
        this.day = holiday.getDay();
        this.date = holiday.getDate();
        this.name = holiday.getName();
    }

    @Override
    public Holiday toEntity() {
        return Holiday.builder()
            .id(id)
            .space(Space.builder().id(space.getId()).build())
            .month(month)
            .holidayType(holidayType)
            .week(week)
            .day(day)
            .date(date)
            .name(name)
            .build();
    }

    public Holiday toEntity(Space space) {
        Holiday holiday = toEntity();
        holiday.setSpace(space);
        return holiday;
    }
}
