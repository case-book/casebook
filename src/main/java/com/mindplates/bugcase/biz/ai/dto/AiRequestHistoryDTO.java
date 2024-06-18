package com.mindplates.bugcase.biz.ai.dto;


import com.mindplates.bugcase.biz.ai.entity.AiRequestHistory;
import com.mindplates.bugcase.biz.ai.entity.Llm;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiRequestHistoryDTO extends CommonDTO {

    Long id;
    private OpenAiModelDTO aiModel;
    private HttpStatus httpStatus;
    private String request;
    private String response;
    private UserDTO requester;

    public AiRequestHistoryDTO(AiRequestHistory aiRequestHistory) {
        this.id = aiRequestHistory.getId();
        if (aiRequestHistory.getModel() != null) {
            this.aiModel = new OpenAiModelDTO(aiRequestHistory.getModel());
        }
        this.httpStatus = aiRequestHistory.getHttpStatus();
        this.request = aiRequestHistory.getRequest();
        this.response = aiRequestHistory.getResponse();
        if (aiRequestHistory.getRequester() != null) {
            this.requester = UserDTO.builder().
                id(aiRequestHistory.getRequester().getId())
                .email(aiRequestHistory.getRequester().getEmail())
                .name(aiRequestHistory.getRequester().getName())
                .build();
        }
    }
}
