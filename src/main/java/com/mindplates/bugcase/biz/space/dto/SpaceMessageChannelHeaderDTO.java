package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannelHeader;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpaceMessageChannelHeaderDTO extends CommonDTO {

    private Long id;
    private SpaceMessageChannelDTO spaceMessageChannel;
    private String dataKey;
    private String dataValue;


    public SpaceMessageChannelHeaderDTO(SpaceMessageChannelHeader spaceMessageChannelHeader) {
        this.id = spaceMessageChannelHeader.getId();
        if (spaceMessageChannelHeader.getSpaceMessageChannel() != null) {
            this.spaceMessageChannel = SpaceMessageChannelDTO.builder().id(spaceMessageChannelHeader.getSpaceMessageChannel().getId()).build();
        }

        this.dataKey = spaceMessageChannelHeader.getDataKey();
        this.dataValue = spaceMessageChannelHeader.getDataValue();
    }
}
