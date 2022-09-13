package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.user.vo.response.SimpleUserResponse;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpaceResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Boolean activated;
    private String token;
    private List<SimpleUserResponse> users;

    public SpaceResponse(Space space) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.description = space.getDescription();
        this.activated = space.getActivated();
        this.token = space.getToken();

        if (space.getUsers() != null) {
            this.users = space.getUsers().stream().map(
                    (spaceUser) -> SimpleUserResponse.builder()
                            .id(spaceUser.getId())
                            .userId(spaceUser.getUser().getId())
                            .role(spaceUser.getRole())
                            .email(spaceUser.getUser().getEmail())
                            .name(spaceUser.getUser().getName())
                            .build()).collect(Collectors.toList());
        }

    }


}
