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
    private String edgeId;
    private SequenceResponse sequence;
    private String type;
    private String sourceNodeId;
    private String targetNodeId;
    private Map<String, String> style;
    private SequenceNodeResponse source;
    private SequenceNodeResponse target;

    public SequenceEdgeResponse(SequenceEdgeDTO sequenceEdge) {
        this.id = sequenceEdge.getId();
        this.edgeId = sequenceEdge.getEdgeId();
        this.type = sequenceEdge.getType();
        this.style = sequenceEdge.getStyle();
        this.sourceNodeId = sequenceEdge.getSourceNodeId();
        this.targetNodeId = sequenceEdge.getTargetNodeId();
        this.source = new SequenceNodeResponse(sequenceEdge.getSource());
        this.target = new SequenceNodeResponse(sequenceEdge.getTarget());
        this.sequence = SequenceResponse.builder().id(sequenceEdge.getSequence().getId()).build();
    }
}
