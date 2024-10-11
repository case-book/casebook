package com.mindplates.bugcase.biz.sequence.vo.request;

import com.mindplates.bugcase.biz.sequence.dto.SequenceDTO;
import com.mindplates.bugcase.biz.sequence.dto.SequenceEdgeDTO;
import com.mindplates.bugcase.biz.sequence.dto.SequenceNodeDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import java.util.List;
import java.util.Map;
import lombok.Data;

@Data
public class SequenceEdgeRequest {

    private Long id;
    private String edgeId;
    private String type;
    private Map<String, String> style;
    private String sourceNodeId;
    private String targetNodeId;

    public SequenceEdgeDTO toDTO(List<SequenceNodeDTO> nodes) {
        return SequenceEdgeDTO.builder()
            .id(id)
            .edgeId(edgeId)
            .type(type)
            .style(style)
            .source(nodes.stream().filter((node -> node.getNodeId().equals(sourceNodeId))).findFirst().orElse(null))
            .target(nodes.stream().filter((node -> node.getNodeId().equals(targetNodeId))).findFirst().orElse(null))
            .sourceNodeId(sourceNodeId)
            .targetNodeId(targetNodeId)
            .build();
    }
}
