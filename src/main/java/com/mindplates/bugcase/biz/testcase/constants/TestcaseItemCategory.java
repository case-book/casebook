package com.mindplates.bugcase.biz.testcase.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum TestcaseItemCategory {
    CASE("CASE"),
    RESULT("RESULT");
    private String category;

}
