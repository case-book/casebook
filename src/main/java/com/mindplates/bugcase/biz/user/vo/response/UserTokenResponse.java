package com.mindplates.bugcase.biz.user.vo.response;


import com.mindplates.bugcase.biz.user.dto.UserTokenDTO;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UserTokenResponse {

    private Long id;
    private Long userId;
    private String name;
    private String token;
    private boolean enabled;
    private LocalDateTime lastAccess;

    public UserTokenResponse(UserTokenDTO userTokenDTO) {
        if (userTokenDTO != null) {
            this.id = userTokenDTO.getId();
            this.userId = userTokenDTO.getUser().getId();
            this.name = userTokenDTO.getName();
            this.token = userTokenDTO.getToken();
            this.enabled = userTokenDTO.isEnabled();
            this.lastAccess = userTokenDTO.getLastAccess();
        }
    }

}
