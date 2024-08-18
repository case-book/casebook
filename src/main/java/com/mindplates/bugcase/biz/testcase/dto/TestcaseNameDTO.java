package com.mindplates.bugcase.biz.testcase.dto;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestcaseNameDTO extends CommonDTO {

    private Long id;
    private String seqId;
    private String name;


    public TestcaseNameDTO(Testcase testcase) {
        this.id = testcase.getId();
        this.seqId = testcase.getSeqId();
        this.name = testcase.getName();
    }


}
