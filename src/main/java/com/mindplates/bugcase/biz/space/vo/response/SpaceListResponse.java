package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SpaceListResponse {

    private Long id;
    private String name;
    private String code;
    private Boolean activated;
    private Boolean allowSearch;
    private Boolean allowAutoJoin;
    private Boolean isMember;
    private Long projectCount;
    private Integer userCount;
    private String description;

    public SpaceListResponse(SpaceDTO space, Long userId) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.isActivated();
        this.allowSearch = space.isAllowSearch();
        this.allowAutoJoin = space.isAllowAutoJoin();
        this.projectCount = space.getProjectCount();
        this.userCount = space.getUsers() != null ? space.getUsers().size() : 0;
        if (userId != null && space.getUsers() != null) {
            this.isMember = space.getUsers().stream().anyMatch((spaceUser -> spaceUser.getUser().getId().equals(userId)));
        }
        this.description = space.getDescription();
    }

    public SpaceListResponse(SpaceDTO space) {
        this(space, null);
    }


}
