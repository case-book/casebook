package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SpaceDTO extends CommonDTO {

    private Long id;

    private String name;

    private String code;

    private String description;

    private boolean activated;

    private boolean allowSearch;

    private boolean allowAutoJoin;

    private String token;

    private List<SpaceUserDTO> users;

    private List<SpaceApplicantDTO> applicants;


}
