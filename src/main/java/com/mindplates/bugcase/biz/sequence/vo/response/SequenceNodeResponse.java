package com.mindplates.bugcase.biz.sequence.vo.response;

import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.sequence.dto.SequenceDTO;
import com.mindplates.bugcase.biz.sequence.dto.SequenceNodeDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseResponse;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class SequenceNodeResponse {

    private Long id;
    private TestcaseResponse testcase;
    private SequenceResponse sequence;
    private String type;
    private Map<String, String> style;
    private Map<String, String> position;

    public SequenceNodeResponse(SequenceNodeDTO sequenceNode) {
        this.id = sequenceNode.getId();
        this.testcase = TestcaseResponse.builder().id(sequenceNode.getTestcase().getId()).build();
        this.sequence = SequenceResponse.builder().id(sequenceNode.getSequence().getId()).build();
        this.type = sequenceNode.getType();
        this.style = sequenceNode.getStyle();
        this.position = sequenceNode.getPosition();
    }
}
