package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SpaceDTO extends CommonDTO implements IDTO<Space> {

    private Long id;
    private String name;
    private String code;
    private String description;
    private boolean activated;
    private boolean allowSearch;
    private boolean allowAutoJoin;
    private String token;
    private String country;
    private String timeZone;
    private List<SpaceUserDTO> users;
    private List<SpaceApplicantDTO> applicants;
    private List<SpaceMessageChannelDTO> messageChannels;
    private List<HolidayDTO> holidays;
    private List<LlmDTO> llms;
    private List<SpaceLlmPromptDTO> llmPrompts;
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

        if (space.getLlmPrompts() != null) {
            this.llmPrompts = space.getLlmPrompts().stream().map(SpaceLlmPromptDTO::new).collect(Collectors.toList());
        }
    }


    @Override
    public Space toEntity() {
        Space space = Space.builder().id(id).name(name).code(code).description(description).activated(activated).allowSearch(allowSearch).allowAutoJoin(allowAutoJoin).token(token).country(country)
            .timeZone(timeZone).build();

        if (users != null) {
            space.setUsers(users.stream().map((spaceUserDTO -> spaceUserDTO.toEntity(space))).collect(Collectors.toList()));
        } else {
            space.setUsers(Collections.emptyList());
        }

        if (applicants != null) {
            space.setApplicants(applicants.stream().map(spaceApplicantDTO -> spaceApplicantDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setApplicants(Collections.emptyList());
        }

        if (holidays != null) {
            space.setHolidays(holidays.stream().map((holidayDTO -> holidayDTO.toEntity(space))).collect(Collectors.toList()));
        } else {
            space.setHolidays(Collections.emptyList());
        }

        if (messageChannels != null) {
            space.setMessageChannels(messageChannels.stream().map(spaceMessageChannelDTO -> spaceMessageChannelDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setMessageChannels(Collections.emptyList());
        }

        if (llms != null) {
            space.setLlms(llms.stream().map(llmDTO -> llmDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setLlms(Collections.emptyList());
        }

        if (llmPrompts != null) {
            space.setLlmPrompts(llmPrompts.stream().map(spaceLlmPromptDTO -> spaceLlmPromptDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setLlmPrompts(Collections.emptyList());
        }

        return space;
    }
}
