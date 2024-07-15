package com.mindplates.bugcase.biz.space.vo.request;

import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelHeaderDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import java.util.HashMap;
import java.util.Map;
import lombok.Data;

@Data
public class SpaceMessageChannelHeaderRequest implements IRequestVO<SpaceMessageChannelHeaderDTO> {

    private Long id;
    private String dataKey;
    private String dataValue;


    @Override
    public SpaceMessageChannelHeaderDTO toDTO() {
        return SpaceMessageChannelHeaderDTO
            .builder()
            .id(id)
            .dataKey(dataKey)
            .dataValue(dataValue)
            .build();

    }

    public SpaceMessageChannelHeaderDTO toDTO(SpaceMessageChannelDTO spaceMessageChannel) {
        SpaceMessageChannelHeaderDTO dto = toDTO();
        dto.setSpaceMessageChannel(spaceMessageChannel);
        return dto;
    }

    public Map<String, String> toMap() {
        Map<String, String> map = new HashMap<>();
        map.put("key", dataKey);
        map.put("value", dataValue);
        return map;
    }
}
