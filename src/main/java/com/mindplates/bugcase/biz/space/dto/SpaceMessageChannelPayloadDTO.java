package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannelPayload;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class SpaceMessageChannelPayloadDTO extends CommonDTO implements IDTO<SpaceMessageChannelPayload> {

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

    @Override
    public SpaceMessageChannelPayload toEntity() {
        return SpaceMessageChannelPayload.builder()
            .id(id)
            .spaceMessageChannel(SpaceMessageChannel.builder().id(spaceMessageChannel.getId()).build())
            .dataKey(dataKey)
            .dataValue(dataValue)
            .build();
    }

    public SpaceMessageChannelPayload toEntity(SpaceMessageChannel spaceMessageChannel) {
        SpaceMessageChannelPayload spaceMessageChannelPayload = toEntity();
        spaceMessageChannelPayload.setSpaceMessageChannel(spaceMessageChannel);
        return spaceMessageChannelPayload;


    }
}
