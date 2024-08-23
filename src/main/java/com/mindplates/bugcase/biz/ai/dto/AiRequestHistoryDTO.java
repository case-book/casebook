package com.mindplates.bugcase.biz.ai.dto;


import com.mindplates.bugcase.biz.ai.entity.AiRequestHistory;
import com.mindplates.bugcase.biz.ai.entity.OpenAiModel;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class AiRequestHistoryDTO extends CommonDTO implements IDTO<AiRequestHistory> {

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

    @Override
    public AiRequestHistory toEntity() {
        return AiRequestHistory.builder()
            .id(id)
            .model(OpenAiModel.builder().id(aiModel.getId()).build())
            .httpStatus(httpStatus)
            .request(request)
            .response(response)
            .requester(User.builder().id(requester.getId()).build())
            .build();

    }
}
