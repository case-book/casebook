package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
public class SpaceMessageChannelDTO extends CommonDTO implements IDTO<SpaceMessageChannel> {

    private Long id;
    private SpaceDTO space;
    private String name;
    private String url;
    private String httpMethod;
    private MessageChannelTypeCode messageChannelType;
    private PayloadTypeCode payloadType;
    private String json;
    private List<SpaceMessageChannelHeaderDTO> headers;
    private List<SpaceMessageChannelPayloadDTO> payloads;

    public SpaceMessageChannelDTO(SpaceMessageChannel spaceMessageChannel) {
        this.id = spaceMessageChannel.getId();
        if (spaceMessageChannel.getSpace() != null) {
            this.space = SpaceDTO.builder().id(spaceMessageChannel.getSpace().getId()).build();
        }
        this.httpMethod = spaceMessageChannel.getHttpMethod();
        this.messageChannelType = spaceMessageChannel.getMessageChannelType();
        this.name = spaceMessageChannel.getName();
        this.payloadType = spaceMessageChannel.getPayloadType();
        this.url = spaceMessageChannel.getUrl();
        this.json = spaceMessageChannel.getJson();
        if (spaceMessageChannel.getHeaders() != null) {
            this.headers = spaceMessageChannel.getHeaders().stream().map(SpaceMessageChannelHeaderDTO::new).collect(Collectors.toList());
        }

        if (spaceMessageChannel.getPayloads() != null) {
            this.payloads = spaceMessageChannel.getPayloads().stream().map(SpaceMessageChannelPayloadDTO::new).collect(Collectors.toList());
        }
    }

    public List<Map<String, String>> getHeaderList() {
        return this.headers.stream().map(payload -> {
            Map<String, String> map = new HashMap<>();
            map.put("key", payload.getDataKey());
            map.put("value", payload.getDataValue());
            return map;
        }).collect(Collectors.toList());
    }

    private List<Map<String, String>> getPayloadList() {
        return this.payloads.stream().map(payload -> {
            Map<String, String> map = new HashMap<>();
            map.put("key", payload.getDataKey());
            map.put("value", payload.getDataValue());
            return map;
        }).collect(Collectors.toList());
    }

    public String getJsonMessage(String message) {

        String jsonMessage = this.json;
        if (jsonMessage.contains("{{message}}")) {
            jsonMessage = jsonMessage.replace("{{message}}", message.replaceAll("\"", "'").replaceAll("\n", "\\\\n"));
        }

        return jsonMessage;
    }

    public List<Map<String, String>> getPayloadMessage(String message) {
        List<Map<String, String>> payloads = getPayloadList();
        payloads.forEach(payload -> {
            payload.forEach((key, value) -> {
                if (value.contains("{{message}}")) {
                    payload.put(key, value.replace("{{message}}", message));
                }
            });
        });

        return payloads;
    }

    @Override
    public SpaceMessageChannel toEntity() {
        SpaceMessageChannel spaceMessageChannel = SpaceMessageChannel.builder()
            .id(id)
            .space(Space.builder().id(space.getId()).build())
            .name(name)
            .url(url)
            .httpMethod(httpMethod)
            .messageChannelType(messageChannelType)
            .payloadType(payloadType)
            .json(json)
            .build();

        if (headers != null) {
            spaceMessageChannel.setHeaders(headers.stream().map(spaceMessageChannelHeaderDTO -> spaceMessageChannelHeaderDTO.toEntity(spaceMessageChannel)).collect(Collectors.toList()));
        }

        if (payloads != null) {
            spaceMessageChannel.setPayloads(payloads.stream().map(spaceMessageChannelPayloadDTO -> spaceMessageChannelPayloadDTO.toEntity(spaceMessageChannel)).collect(Collectors.toList()));
        }

        return spaceMessageChannel;
    }

    public SpaceMessageChannel toEntity(Space space) {
        SpaceMessageChannel spaceMessageChannel = toEntity();
        spaceMessageChannel.setSpace(space);
        return spaceMessageChannel;
    }
}
