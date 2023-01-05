package com.mindplates.bugcase.biz.testcase.vo.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
public class TestcaseTemplateDataResponse {

    List<String> testcaseItemTypes;

    List<String> testcaseItemCategories;

    public TestcaseTemplateDataResponse(List<String> testcaseItemTypes, List<String> testcaseItemCategories) {
        this.testcaseItemTypes = testcaseItemTypes;
        this.testcaseItemCategories = testcaseItemCategories;
    }
}
