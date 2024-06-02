package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import com.mindplates.bugcase.common.vo.IRequestVO;
import java.util.List;
import lombok.Data;
import org.springframework.http.HttpMethod;

@Data
public class SpaceMessageChannelRequest implements IRequestVO<SpaceMessageChannelDTO> {

    private Long id;
    private String name;
    private String url;
    private HttpMethod httpMethod;
    private MessageChannelTypeCode messageChannelType;
    private PayloadTypeCode payloadType;
    private String json;
    private List<SpaceMessageChannelHeaderRequest> headers;
    private List<SpaceMessageChannelPayloadRequest> payloads;

    @Override
    public SpaceMessageChannelDTO toDTO() {
        SpaceMessageChannelDTO dto = SpaceMessageChannelDTO
            .builder()
            .id(id)
            .name(name)
            .url(url)
            .httpMethod(httpMethod)
            .messageChannelType(messageChannelType)
            .payloadType(payloadType)
            .json(json)
            .build();

        if (headers != null) {
            dto.setHeaders(headers.stream().map(spaceMessageChannelHeaderRequest -> spaceMessageChannelHeaderRequest.toDTO(dto)).collect(java.util.stream.Collectors.toList()));
        }

        if (payloads != null) {
            dto.setPayloads(payloads.stream().map(spaceMessageChannelPayloadRequest -> spaceMessageChannelPayloadRequest.toDTO(dto)).collect(java.util.stream.Collectors.toList()));
        }

        return dto;
    }

    public SpaceMessageChannelDTO toDTO(SpaceDTO space) {
        SpaceMessageChannelDTO dto = toDTO();
        dto.setSpace(space);
        return dto;

    }


}
