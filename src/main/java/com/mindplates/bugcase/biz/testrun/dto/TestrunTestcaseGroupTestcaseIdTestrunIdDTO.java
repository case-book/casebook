package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseIdTestrunIdDTO {

    private Long testrunId;
    private String seqId;
    private Long testrunTestcaseGroupTestcaseId;

    public TestrunTestcaseGroupTestcaseIdTestrunIdDTO(long testrunId, String seqId, long testrunTestcaseGroupTestcaseId) {
        this.testrunId = testrunId;
        this.seqId = seqId;
        this.testrunTestcaseGroupTestcaseId = testrunTestcaseGroupTestcaseId;
    }


}
