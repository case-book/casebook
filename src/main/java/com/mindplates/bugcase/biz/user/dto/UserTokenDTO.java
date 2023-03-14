package com.mindplates.bugcase.biz.user.dto;

import com.mindplates.bugcase.biz.user.entity.UserToken;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import java.time.LocalDateTime;


@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserTokenDTO extends CommonEntity {

    private Long id;
    private UserDTO user;
    private String name;
    private String token;
    private boolean enabled;
    private LocalDateTime lastAccess;

    public UserTokenDTO(UserToken userToken) {
        this.id = userToken.getId();
        this.user = UserDTO.builder().id(userToken.getUser().getId()).build();
        this.name = userToken.getName();
        this.token = userToken.getToken();
        this.enabled = userToken.isEnabled();
        this.lastAccess = userToken.getLastAccess();
    }

}
