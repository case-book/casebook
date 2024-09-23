package com.mindplates.bugcase.biz.sequence.vo.response;

import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.sequence.dto.SequenceDTO;
import com.mindplates.bugcase.biz.testcase.vo.response.TestcaseResponse;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class SequenceResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectResponse project;
    private List<SequenceNodeResponse> nodes;
    private List<SequenceEdgeResponse> edges;

    public SequenceResponse(SequenceDTO sequence) {
        this.id = sequence.getId();
        this.name = sequence.getName();
        this.description = sequence.getDescription();
        this.project = ProjectResponse.builder().id(sequence.getProject().getId()).build();
        this.nodes = sequence.getNodes().stream().map(SequenceNodeResponse::new).collect(Collectors.toList());
        this.edges = sequence.getEdges().stream().map(SequenceEdgeResponse::new).collect(Collectors.toList());

    }
}
