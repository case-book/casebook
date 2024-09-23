package com.mindplates.bugcase.biz.sequence.vo.request;

import com.mindplates.bugcase.biz.sequence.dto.SequenceNodeDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import java.util.Map;
import lombok.Data;

@Data
public class SequenceNodeRequest {

    private Long id;
    private String nodeId;
    private Long testcaseId;
    private String type;
    private Map<String, String> style;
    private Map<String, String> position;

    public SequenceNodeDTO toDTO() {
        return SequenceNodeDTO.builder()
            .id(id)
            .nodeId(nodeId)
            .testcase(TestcaseDTO.builder().id(testcaseId).build())
            .type(type)
            .style(style)
            .position(position)
            .build();
    }
}
