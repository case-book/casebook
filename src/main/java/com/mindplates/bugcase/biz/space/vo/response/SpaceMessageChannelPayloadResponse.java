package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelHeaderDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelPayloadDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpaceMessageChannelPayloadResponse {

    private Long id;
    private String dataKey;
    private String dataValue;

    public SpaceMessageChannelPayloadResponse(SpaceMessageChannelPayloadDTO spaceMessageChannelPayloadDTO) {
        this.id = spaceMessageChannelPayloadDTO.getId();
        this.dataKey = spaceMessageChannelPayloadDTO.getDataKey();
        this.dataValue = spaceMessageChannelPayloadDTO.getDataValue();
    }
}
