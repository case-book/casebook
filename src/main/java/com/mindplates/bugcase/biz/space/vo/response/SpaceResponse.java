package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.user.vo.response.SimpleSpaceUserResponse;
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
    private List<SimpleSpaceUserResponse> users;

    private Long projectCount;

    public SpaceResponse(Space space) {
        this(space, null);
    }

    public SpaceResponse(Space space, Long projectCount) {

        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.getActivated();
        this.projectCount = projectCount;
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.description = space.getDescription();
        this.activated = space.getActivated();
        this.token = space.getToken();

        if (space.getUsers() != null) {
            this.users = space.getUsers().stream().map(
                    (spaceUser) -> SimpleSpaceUserResponse.builder()
                            .id(spaceUser.getId())
                            .userId(spaceUser.getUser().getId())
                            .role(spaceUser.getRole())
                            .email(spaceUser.getUser().getEmail())
                            .name(spaceUser.getUser().getName())
                            .build()).collect(Collectors.toList());
        }
    }


}
