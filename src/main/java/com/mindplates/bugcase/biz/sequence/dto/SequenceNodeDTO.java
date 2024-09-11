package com.mindplates.bugcase.biz.sequence.dto;

import com.mindplates.bugcase.biz.sequence.entity.Sequence;
import com.mindplates.bugcase.biz.sequence.entity.SequenceNode;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
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
public class SequenceNodeDTO extends CommonDTO implements IDTO<SequenceNode> {

    private Long id;
    private TestcaseDTO testcase;
    private SequenceDTO sequence;
    private String type;
    private Map<String, String> style;
    private Map<String, String> position;

    public SequenceNodeDTO(SequenceNode sequenceNode) {
        this.id = sequenceNode.getId();
        this.testcase = TestcaseDTO.builder().id(sequenceNode.getTestcase().getId()).build();
        this.sequence = SequenceDTO.builder().id(sequenceNode.getSequence().getId()).build();
        this.type = sequenceNode.getType();
        this.style = sequenceNode.getStyle();
        this.position = sequenceNode.getPosition();
    }


    @Override
    public SequenceNode toEntity() {
        SequenceNode sequenceNode = SequenceNode.builder()
            .id(this.id)
            .type(this.type)
            .style(this.style)
            .position(this.position)
            .build();

        if (this.testcase != null) {
            sequenceNode.setTestcase(Testcase.builder().id(testcase.getId()).build());
        }

        if (this.sequence != null) {
            sequenceNode.setSequence(Sequence.builder().id(sequence.getId()).build());
        }

        return sequenceNode;
    }


    public SequenceNode toEntity(Sequence sequence) {
        SequenceNode sequenceNode = toEntity();

        if (this.sequence != null) {
            sequenceNode.setSequence(sequence);
        }

        return sequenceNode;
    }


}
