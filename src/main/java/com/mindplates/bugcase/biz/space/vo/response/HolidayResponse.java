package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.HolidayDTO;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HolidayResponse {

    private Long id;
    private Long spaceId;
    private Boolean isRegular;
    private String date;
    private String name;

    public HolidayResponse(HolidayDTO holiday) {
        this.id = holiday.getId();
        this.spaceId = holiday.getSpace().getId();
        this.isRegular = holiday.getIsRegular();
        this.date = holiday.getDate();
        this.name = holiday.getName();
    }
}
