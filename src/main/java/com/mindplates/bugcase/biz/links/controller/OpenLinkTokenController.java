package com.mindplates.bugcase.biz.links.controller;

import com.mindplates.bugcase.biz.links.dto.OpenLinkDTO;
import com.mindplates.bugcase.biz.links.service.OpenLinkService;
import com.mindplates.bugcase.biz.links.vo.response.OpenLinkResponse;
import com.mindplates.bugcase.biz.links.vo.response.OpenLinkShareResponse;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/links/{token}")
@AllArgsConstructor
public class OpenLinkTokenController {

    private final OpenLinkService openLinkService;

    private final ProjectService projectService;

    @Operation(description = "오픈 링크 상세 조회")
    @GetMapping("")
    public OpenLinkShareResponse selectOpenLinkInfo(@PathVariable String token) {
        OpenLinkDTO openLink = openLinkService.selectOpenLinkInfoByToken(token);
        List<UserDTO> users = projectService.selectProjectUserList(openLink.getProject().getId());
        return new OpenLinkShareResponse(openLink, users);
    }


}

