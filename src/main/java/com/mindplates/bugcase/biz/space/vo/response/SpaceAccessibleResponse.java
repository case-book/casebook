package com.mindplates.bugcase.biz.space.vo.response;

import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.user.vo.response.SimpleMemberResponse;
import com.mindplates.bugcase.common.code.UserRoleCode;
import java.util.List;
import java.util.stream.Collectors;
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
public class SpaceAccessibleResponse {

    private Long id;
    private String name;
    private String code;
    private String description;
    private Boolean activated;

    private List<SimpleMemberResponse> admins;
    private Boolean allowSearch;
    private Boolean allowAutoJoin;

    private SpaceApplicantResponse applicant;

    public SpaceAccessibleResponse(SpaceDTO space, Long userId) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.allowSearch = space.isAllowSearch();
        if (space.isAllowSearch()) {
            this.activated = space.isActivated();
            this.description = space.getDescription();
            this.allowAutoJoin = space.isAllowAutoJoin();
        }

        if (space.isAllowSearch() && space.getUsers() != null) {
            this.admins = space.getUsers().stream().filter((spaceUser -> UserRoleCode.ADMIN.equals(spaceUser.getRole()))).map(
                (spaceUser) -> SimpleMemberResponse.builder()
                    .id(spaceUser.getId())
                    .userId(spaceUser.getUser().getId())
                    .role(spaceUser.getRole())
                    .email(spaceUser.getUser().getEmail())
                    .name(spaceUser.getUser().getName())
                    .build()).collect(Collectors.toList());
        }

        if (space.getApplicants() != null) {
            SpaceApplicantDTO userApplicantInfo = space.getApplicants()
                .stream()
                .filter(spaceApplicant -> spaceApplicant.getUser().getId().equals(userId))
                .findAny().orElse(null);
            if (userApplicantInfo != null) {
                this.applicant = new SpaceApplicantResponse(userApplicantInfo);
            }

        }
    }


}
