package com.mindplates.bugcase.biz.sequence.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.sequence.dto.SequenceDTO;
import com.mindplates.bugcase.biz.sequence.dto.SequenceNodeDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Data;

@Data
public class SequenceUpdateRequest {

    private long id;
    private String name;
    private String description;
    private Long projectId;
    private List<SequenceNodeRequest> nodes;
    private List<SequenceEdgeRequest> edges;

    public SequenceDTO toDTO(long projectId) {
        List<SequenceNodeDTO> nodeList = nodes.stream().map(SequenceNodeRequest::toDTO).collect(Collectors.toList());
        return SequenceDTO.builder()
            .name(name)
            .description(description)
            .project(ProjectDTO.builder().id(projectId).build())
            .nodes(nodeList)
            .edges(edges.stream().map((sequenceEdge -> sequenceEdge.toDTO(nodeList))).collect(Collectors.toList()))
            .build();
    }
}
