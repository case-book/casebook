package com.mindplates.bugcase.biz.project.dto;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectFileDTO extends CommonDTO {

    private Long id;
    private ProjectDTO project;
    private String name;
    private String type;
    private String path;
    private Long size;
    private String uuid;


}
