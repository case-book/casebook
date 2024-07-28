package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class TestrunResultItemsRequest {

    private List<TestrunTestcaseGroupTestcaseItemRequest> testrunTestcaseGroupTestcaseItemRequests;

    public List<TestrunTestcaseGroupTestcaseItemDTO> toDTO() {

        return testrunTestcaseGroupTestcaseItemRequests.stream()
            .map((testrunTestcaseGroupTestcaseItemRequest -> testrunTestcaseGroupTestcaseItemRequest.toDTO())).collect(Collectors.toList());


    }


}
