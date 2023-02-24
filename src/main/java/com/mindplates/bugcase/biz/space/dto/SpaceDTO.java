package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;


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
    private List<HolidayDTO> holidays;
    private Long projectCount;

    public SpaceDTO(Space space) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.isActivated();
        this.description = space.getDescription();
        this.allowSearch = space.isAllowSearch();
        this.allowAutoJoin = space.isAllowAutoJoin();
        this.token = space.getToken();
        if (space.getUsers() != null) {
            this.users = space.getUsers().stream().map(SpaceUserDTO::new).collect(Collectors.toList());
        }

        if (space.getApplicants() != null) {
            this.applicants = space.getApplicants().stream().map(SpaceApplicantDTO::new).collect(Collectors.toList());
        }

        if (space.getHolidays() != null) {
            this.holidays = space.getHolidays().stream().map(HolidayDTO::new).collect(Collectors.toList());
        }
    }


}
