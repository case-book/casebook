package com.mindplates.bugcase.biz.sequence.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.sequence.entity.Sequence;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
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
public class SequenceDTO extends CommonDTO implements IDTO<Sequence> {

    private Long id;
    private String name;
    private String description;
    private ProjectDTO project;
    private List<SequenceNodeDTO> nodes;
    private List<SequenceEdgeDTO> edges;

    public SequenceDTO(Sequence sequence) {
        this.id = sequence.getId();
        this.name = sequence.getName();
        this.description = sequence.getDescription();

        if (sequence.getProject() != null) {
            this.project = ProjectDTO.builder().id(sequence.getProject().getId()).build();
        }

        if (sequence.getNodes() != null) {
            this.nodes = sequence.getNodes().stream().map(SequenceNodeDTO::new).collect(Collectors.toList());
        } else {
            this.nodes = Collections.emptyList();
        }

        if (sequence.getEdges() != null) {
            this.edges = sequence.getEdges().stream().map(SequenceEdgeDTO::new).collect(Collectors.toList());
        } else {
            this.edges = Collections.emptyList();
        }
    }


    @Override
    public Sequence toEntity() {
        Sequence sequence = Sequence.builder()
            .id(this.id)
            .name(this.name)
            .description(this.description)
            .build();

        if (this.project != null) {
            sequence.setProject(Project.builder().id(project.getId()).build());
        }

        if (this.nodes != null) {
            sequence.setNodes(this.nodes.stream().map(sequenceNodeDTO -> sequenceNodeDTO.toEntity(sequence)).collect(Collectors.toList()));
        } else {
            sequence.setNodes(Collections.emptyList());
        }

        if (this.edges != null) {
            sequence.setEdges(this.edges.stream().map(sequenceEdgeDTO -> sequenceEdgeDTO.toEntity(sequence, sequence.getNodes())).collect(Collectors.toList()));
        } else {
            sequence.setEdges(Collections.emptyList());
        }

        return sequence;
    }


    public Sequence toEntity(Project project) {
        Sequence sequence = toEntity();

        if (this.project != null) {
            sequence.setProject(project);
        }

        return sequence;
    }


}
