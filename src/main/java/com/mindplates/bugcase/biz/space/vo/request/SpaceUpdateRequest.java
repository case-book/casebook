package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.ai.vo.request.LlmRequest;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Data;

@Data
public class SpaceUpdateRequest implements IRequestVO<SpaceDTO> {

    @NotNull
    private Long id;
    @NotBlank
    @Size(min = 1)
    private String name;
    private String description;
    private Boolean activated;
    @NotBlank
    private String token;
    private List<SpaceUserRequest> users;
    private Boolean allowSearch;
    private Boolean allowAutoJoin;
    private List<HolidayRequest> holidays;
    private String country;
    private String timeZone;
    private List<SpaceMessageChannelRequest> messageChannels;
    private List<LlmRequest> llms;
    private List<SpaceLlmPromptRequest> llmPrompts;

    @Override
    public SpaceDTO toDTO() {
        return toDTO(null);
    }

    public SpaceDTO toDTO(String code) {

        SpaceDTO space = SpaceDTO.builder().id(id).name(name).code(code).description(description).activated(activated).token(token).allowSearch(allowSearch).allowAutoJoin(allowAutoJoin)
            .country(country).timeZone(timeZone).build();

        if (users != null) {
            List<SpaceUserDTO> spaceUsers = users.stream().map(spaceUser -> spaceUser.toDTO(space)).collect(Collectors.toList());
            space.setUsers(spaceUsers);
        }

        if (holidays != null) {
            space.setHolidays(holidays.stream().map(holiday -> holiday.toDTO(space)).collect(Collectors.toList()));
        }

        if (messageChannels != null) {
            space.setMessageChannels(messageChannels.stream().map(messageChannel -> messageChannel.toDTO(space)).collect(Collectors.toList()));
        }

        if (llms != null) {
            space.setLlms(llms.stream().map(llm -> llm.toDTO(space)).collect(Collectors.toList()));
        }

        if (llmPrompts != null) {
            space.setLlmPrompts(llmPrompts.stream().map(llmPrompt -> llmPrompt.toDTO(space)).collect(Collectors.toList()));
        }

        return space;
    }
}
