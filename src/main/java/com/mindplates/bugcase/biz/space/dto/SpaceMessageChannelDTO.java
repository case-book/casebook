package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpMethod;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceMessageChannelDTO extends CommonDTO {

    private Long id;
    private SpaceDTO space;
    private String name;
    private String url;
    private HttpMethod httpMethod;
    private MessageChannelTypeCode messageChannelType;
    private PayloadTypeCode payloadType;
    private String json;
    private List<SpaceMessageChannelHeaderDTO> headers;
    private List<SpaceMessageChannelPayloadDTO> payloads;

    public SpaceMessageChannelDTO(SpaceMessageChannel spaceMessageChannel) {
        this.id = spaceMessageChannel.getId();
        this.space = SpaceDTO.builder().id(spaceMessageChannel.getSpace().getId()).build();
        this.httpMethod = spaceMessageChannel.getHttpMethod();
        this.messageChannelType = spaceMessageChannel.getMessageChannelType();
        this.name = spaceMessageChannel.getName();
        this.payloadType = spaceMessageChannel.getPayloadType();
        this.url = spaceMessageChannel.getUrl();
        this.json = spaceMessageChannel.getJson();
        this.headers = spaceMessageChannel.getHeaders().stream().map(SpaceMessageChannelHeaderDTO::new).collect(Collectors.toList());
        this.payloads = spaceMessageChannel.getPayloads().stream().map(SpaceMessageChannelPayloadDTO::new).collect(Collectors.toList());
    }
}
