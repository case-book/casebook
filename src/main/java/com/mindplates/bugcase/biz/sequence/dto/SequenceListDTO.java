package com.mindplates.bugcase.biz.sequence.dto;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.sequence.entity.Sequence;
import com.mindplates.bugcase.common.dto.CommonDTO;
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
public class SequenceListDTO extends CommonDTO {

    private Long id;
    private String name;
    private String description;
    private ProjectDTO project;


    public SequenceListDTO(Sequence sequence) {
        this.id = sequence.getId();
        this.name = sequence.getName();
        this.description = sequence.getDescription();

        if (sequence.getProject() != null) {
            this.project = ProjectDTO.builder().id(sequence.getProject().getId()).build();
        }


    }


}
