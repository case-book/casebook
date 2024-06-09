package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannelHeader;
import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannelPayload;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceMessageChannelPayloadDTO extends CommonDTO {

    private Long id;
    private SpaceMessageChannelDTO spaceMessageChannel;
    private String dataKey;
    private String dataValue;


    public SpaceMessageChannelPayloadDTO(SpaceMessageChannelPayload spaceMessageChannelPayload) {
        this.id = spaceMessageChannelPayload.getId();
        if (spaceMessageChannelPayload.getSpaceMessageChannel() != null) {
            this.spaceMessageChannel = SpaceMessageChannelDTO.builder().id(spaceMessageChannelPayload.getSpaceMessageChannel().getId()).build();
        }
        this.dataKey = spaceMessageChannelPayload.getDataKey();
        this.dataValue = spaceMessageChannelPayload.getDataValue();
    }
}
