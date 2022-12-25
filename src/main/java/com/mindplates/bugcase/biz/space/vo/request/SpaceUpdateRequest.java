package com.mindplates.bugcase.biz.space.vo.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;

@Data
public class SpaceUpdateRequest {

    @NotNull
    private Long id;
    @NotBlank
    @Size(min = 1)
    private String name;
    private String description;
    private Boolean activated;
    @NotBlank
    private String token;
    private List<SpaceUserRequest> users;
    private Boolean allowSearch;
    private Boolean allowAutoJoin;


}
