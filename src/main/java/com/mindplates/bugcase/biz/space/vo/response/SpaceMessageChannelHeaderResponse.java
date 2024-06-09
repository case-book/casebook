package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelHeaderDTO;
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
public class SpaceMessageChannelHeaderResponse {

    private Long id;
    private String dataKey;
    private String dataValue;

    public SpaceMessageChannelHeaderResponse(SpaceMessageChannelHeaderDTO spaceMessageChannelHeader) {
        this.id = spaceMessageChannelHeader.getId();
        this.dataKey = spaceMessageChannelHeader.getDataKey();
        this.dataValue = spaceMessageChannelHeader.getDataValue();
    }
}
