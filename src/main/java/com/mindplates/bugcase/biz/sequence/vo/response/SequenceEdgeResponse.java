package com.mindplates.bugcase.biz.sequence.vo.response;

import com.mindplates.bugcase.biz.sequence.dto.SequenceEdgeDTO;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class SequenceEdgeResponse {

    private Long id;
    private SequenceResponse sequence;
    private String type;
    private Map<String, String> style;
    private SequenceNodeResponse source;
    private SequenceNodeResponse target;

    public SequenceEdgeResponse(SequenceEdgeDTO sequenceEdge) {
        this.id = sequenceEdge.getId();
        this.type = sequenceEdge.getType();
        this.style = sequenceEdge.getStyle();
        this.source = SequenceNodeResponse.builder().id(sequenceEdge.getSource().getId()).build();
        this.target = SequenceNodeResponse.builder().id(sequenceEdge.getTarget().getId()).build();
        this.sequence = SequenceResponse.builder().id(sequenceEdge.getSequence().getId()).build();
    }
}
