package com.mindplates.bugcase.biz.sequence.vo.response;

import com.mindplates.bugcase.biz.project.vo.response.ProjectResponse;
import com.mindplates.bugcase.biz.sequence.dto.SequenceListDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@AllArgsConstructor
@Getter
@Builder
public class SequenceListResponse {

    private Long id;
    private String name;
    private String description;
    private ProjectResponse project;

    public SequenceListResponse(SequenceListDTO sequence) {
        this.id = sequence.getId();
        this.name = sequence.getName();
        this.description = sequence.getDescription();
        this.project = ProjectResponse.builder().id(sequence.getProject().getId()).build();

    }
}
