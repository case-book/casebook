package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
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
    private List<SpaceMessageChannelDTO> messageChannels;
    private List<HolidayDTO> holidays;
    private String country;
    private String timeZone;
    private Long projectCount;
    private List<LlmDTO> llms;

    public SpaceDTO(Space space) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.isActivated();
        this.description = space.getDescription();
        this.allowSearch = space.isAllowSearch();
        this.allowAutoJoin = space.isAllowAutoJoin();
        this.token = space.getToken();
        this.country = space.getCountry();
        this.timeZone = space.getTimeZone();
        if (space.getUsers() != null) {
            this.users = space.getUsers().stream().map(SpaceUserDTO::new).collect(Collectors.toList());
        }

        if (space.getApplicants() != null) {
            this.applicants = space.getApplicants().stream().map(SpaceApplicantDTO::new).collect(Collectors.toList());
        }

        if (space.getHolidays() != null) {
            this.holidays = space.getHolidays().stream().map(HolidayDTO::new).collect(Collectors.toList());
        }

        if (space.getMessageChannels() != null) {
            this.messageChannels = space.getMessageChannels().stream().map(SpaceMessageChannelDTO::new).collect(Collectors.toList());
        }

        if (space.getLlms() != null) {
            this.llms = space.getLlms().stream().map(LlmDTO::new).collect(Collectors.toList());
        }
    }


}
