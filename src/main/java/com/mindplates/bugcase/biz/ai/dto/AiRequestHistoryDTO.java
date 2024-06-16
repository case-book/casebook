package com.mindplates.bugcase.biz.ai.dto;


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
}
