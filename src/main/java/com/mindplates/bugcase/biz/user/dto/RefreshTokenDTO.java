package com.mindplates.bugcase.biz.user.dto;

import com.mindplates.bugcase.biz.user.entity.RefreshToken;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class RefreshTokenDTO extends CommonDTO {

    private long id;
    private String value;
    private long userId;

    public RefreshTokenDTO(RefreshToken refreshToken) {
        this.id = refreshToken.getId();
        this.value = refreshToken.getValue();
        this.userId = refreshToken.getUserId();
    }

}
