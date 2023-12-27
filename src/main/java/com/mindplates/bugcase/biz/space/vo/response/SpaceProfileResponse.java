package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import java.time.LocalDateTime;
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
public class SpaceProfileResponse {

    private Long id;
    private String name;
    private boolean isDefault;
    private LocalDateTime creationDate;
    private LocalDateTime lastUpdateDate;

    public SpaceProfileResponse(SpaceProfileDTO spaceProfile) {
        this.id = spaceProfile.getId();
        this.name = spaceProfile.getName();
        this.isDefault = spaceProfile.isDefault();
        this.creationDate = spaceProfile.getCreationDate();
        this.lastUpdateDate = spaceProfile.getLastUpdateDate();
    }

}
