package com.mindplates.bugcase.biz.sequence.dto;

import com.mindplates.bugcase.biz.sequence.entity.Sequence;
import com.mindplates.bugcase.biz.sequence.entity.SequenceEdge;
import com.mindplates.bugcase.biz.sequence.entity.SequenceNode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class SequenceEdgeDTO extends CommonDTO implements IDTO<SequenceEdge> {

    private Long id;
    private String edgeId;
    private SequenceDTO sequence;
    private String type;
    private String sourceNodeId;
    private String targetNodeId;
    private Map<String, String> style;
    private SequenceNodeDTO source;
    private SequenceNodeDTO target;

    public SequenceEdgeDTO(SequenceEdge sequenceEdge) {
        this.id = sequenceEdge.getId();
        this.edgeId = sequenceEdge.getEdgeId();
        this.sequence = SequenceDTO.builder().id(sequenceEdge.getSequence().getId()).build();
        this.sourceNodeId = sequenceEdge.getSourceNodeId();
        this.targetNodeId = sequenceEdge.getTargetNodeId();
        this.type = sequenceEdge.getType();
        this.style = sequenceEdge.getStyle();

        if (sequenceEdge.getSource() != null) {
            this.source = new SequenceNodeDTO(sequenceEdge.getSource());
        }

        if (sequenceEdge.getTarget() != null) {
            this.target = new SequenceNodeDTO(sequenceEdge.getTarget());
        }
    }


    @Override
    public SequenceEdge toEntity() {

        SequenceEdge sequenceEdge = SequenceEdge.builder()
            .id(this.id)
            .edgeId(this.edgeId)
            .type(this.type)
            .style(this.style)
            .sourceNodeId(this.sourceNodeId)
            .targetNodeId(this.targetNodeId)
            .build();





        return sequenceEdge;
    }

    public SequenceEdge toEntity(Sequence sequence, List<SequenceNode> nodes) {
        SequenceEdge sequenceEdge = toEntity();
        sequenceEdge.setSequence(sequence);

        if (this.source != null) {
            sequenceEdge.setSource(nodes.stream().filter(sequenceNode -> sequenceNode.getNodeId().equals(source.getNodeId())).findFirst().orElse(null));
        }

        if (this.target != null) {
            sequenceEdge.setTarget(nodes.stream().filter(sequenceNode -> sequenceNode.getNodeId().equals(target.getNodeId())).findFirst().orElse(null));
        }
        return sequenceEdge;
    }


}
