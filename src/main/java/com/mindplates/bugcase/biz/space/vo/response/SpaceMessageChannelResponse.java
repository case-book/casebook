package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpMethod;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpaceMessageChannelResponse {

    private Long id;
    private String name;
    private String url;
    private HttpMethod httpMethod;
    private MessageChannelTypeCode messageChannelType;
    private PayloadTypeCode payloadType;
    private String json;
    private List<SpaceMessageChannelHeaderResponse> headers;
    private List<SpaceMessageChannelPayloadResponse> payloads;

    public SpaceMessageChannelResponse(SpaceMessageChannelDTO spaceMessageChannel) {
        this.id = spaceMessageChannel.getId();
        this.name = spaceMessageChannel.getName();
        this.url = spaceMessageChannel.getUrl();
        this.httpMethod = spaceMessageChannel.getHttpMethod();
        this.messageChannelType = spaceMessageChannel.getMessageChannelType();
        this.json = spaceMessageChannel.getJson();
        this.payloadType = spaceMessageChannel.getPayloadType();
        if (spaceMessageChannel.getHeaders() != null) {
            this.headers = spaceMessageChannel.getHeaders().stream().map(SpaceMessageChannelHeaderResponse::new).collect(java.util.stream.Collectors.toList());
        }
        if (spaceMessageChannel.getPayloads() != null) {
            this.payloads = spaceMessageChannel.getPayloads().stream().map(SpaceMessageChannelPayloadResponse::new).collect(java.util.stream.Collectors.toList());
        }
    }
}
