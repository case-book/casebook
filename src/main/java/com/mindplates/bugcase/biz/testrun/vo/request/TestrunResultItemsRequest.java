package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
public class TestrunResultItemsRequest {

    private List<TestrunTestcaseGroupTestcaseItemRequest> testrunTestcaseGroupTestcaseItemRequests;

    public List<TestrunTestcaseGroupTestcaseItem> buildEntity() {

        return testrunTestcaseGroupTestcaseItemRequests.stream().map((testrunTestcaseGroupTestcaseItemRequest -> testrunTestcaseGroupTestcaseItemRequest.buildEntity())).collect(Collectors.toList());


    }


}
