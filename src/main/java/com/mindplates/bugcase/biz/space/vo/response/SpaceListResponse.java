package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
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
public class SpaceListResponse {

    private Long id;
    private String name;
    private String code;
    private Boolean activated;
    private Boolean allowSearch;
    private Boolean allowAutoJoin;
    private Boolean isMember;
    private Boolean isAdmin;
    private Long projectCount;
    private Long userCount;
    private String description;

    public SpaceListResponse(SpaceDTO space) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.isActivated();
        this.allowSearch = space.isAllowSearch();
        this.allowAutoJoin = space.isAllowAutoJoin();
        this.projectCount = space.getProjectCount();
        this.userCount = space.getUserCount();
        this.isMember = space.isMember();
        this.isAdmin = space.isAdmin();
        this.description = space.getDescription();
    }


}
