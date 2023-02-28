package com.mindplates.bugcase.common.code;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum HolidayTypeCode {

    YEARLY("YEARLY"),
    SPECIFIED_DATE("SPECIFIED_DATE"),
    CONDITION("CONDITION");
    private String code;

}
