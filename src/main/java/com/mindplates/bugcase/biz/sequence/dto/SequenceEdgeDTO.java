package com.mindplates.bugcase.biz.sequence.dto;

import com.mindplates.bugcase.biz.sequence.entity.Sequence;
import com.mindplates.bugcase.biz.sequence.entity.SequenceEdge;
import com.mindplates.bugcase.biz.sequence.entity.SequenceNode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
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
    private SequenceDTO sequence;
    private String type;
    private Map<String, String> style;
    private SequenceNodeDTO source;
    private SequenceNodeDTO target;

    public SequenceEdgeDTO(SequenceEdge sequenceEdge) {
        this.id = sequenceEdge.getId();
        this.sequence = new SequenceDTO(sequenceEdge.getSequence());
        this.type = sequenceEdge.getType();
        this.style = sequenceEdge.getStyle();

        if (sequenceEdge.getSource() != null) {
            this.source = SequenceNodeDTO.builder().id(sequenceEdge.getSource().getId()).build();
        }

        if (sequenceEdge.getTarget() != null) {
            this.target = SequenceNodeDTO.builder().id(sequenceEdge.getTarget().getId()).build();
        }
    }


    @Override
    public SequenceEdge toEntity() {

        SequenceEdge sequenceEdge = SequenceEdge.builder()
            .id(this.id)
            .type(this.type)
            .style(this.style)
            .build();

        if (this.sequence != null) {
            sequenceEdge.setSequence(Sequence.builder().id(sequence.getId()).build());
        }

        if (this.source != null) {
            sequenceEdge.setSource(SequenceNode.builder().id(source.getId()).build());
        }

        if (this.target != null) {
            sequenceEdge.setSource(SequenceNode.builder().id(target.getId()).build());
        }

        return sequenceEdge;
    }

    public SequenceEdge toEntity(Sequence sequence) {
        SequenceEdge sequenceEdge = toEntity();

        if (this.sequence != null) {
            sequenceEdge.setSequence(sequence);
        }

        return sequenceEdge;
    }


}
