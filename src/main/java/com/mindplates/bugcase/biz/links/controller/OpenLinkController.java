package com.mindplates.bugcase.biz.links.controller;

import com.mindplates.bugcase.biz.links.dto.OpenLinkDTO;
import com.mindplates.bugcase.biz.links.service.OpenLinkService;
import com.mindplates.bugcase.biz.links.vo.request.OpenLinkRequest;
import com.mindplates.bugcase.biz.links.vo.response.OpenLinkListResponse;
import com.mindplates.bugcase.biz.links.vo.response.OpenLinkResponse;
import io.swagger.v3.oas.annotations.Operation;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/links")
@AllArgsConstructor
public class OpenLinkController {

    private final OpenLinkService openLinkService;

    @Operation(description = "오픈 링크 목록 조회")
    @GetMapping
    public List<OpenLinkListResponse> selectOpenLinkList(@PathVariable String spaceCode, @PathVariable long projectId) {
        List<OpenLinkDTO> openLinkList = openLinkService.selectOpenLinkList(projectId);
        return openLinkList.stream().map(OpenLinkListResponse::new).collect(Collectors.toList());
    }

    @Operation(description = "오픈 링크 생성")
    @PostMapping
    public OpenLinkListResponse createOpenLink(@PathVariable String spaceCode, @PathVariable long projectId, @Valid @RequestBody OpenLinkRequest openLinkRequest) {
        OpenLinkDTO openLink = openLinkService.createOpenLink(projectId, openLinkRequest.toDTO(projectId));
        return new OpenLinkListResponse(openLink);
    }

    @Operation(description = "오픈 링크 상세 조회")
    @GetMapping("/{openLinkId}")
    public OpenLinkResponse selectOpenLinkInfo(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long openLinkId) {
        OpenLinkDTO openLink = openLinkService.selectOpenLinkInfo(projectId, openLinkId);
        return new OpenLinkResponse(openLink);
    }

    @Operation(description = "오픈 링크 삭제")
    @DeleteMapping("/{openLinkId}")
    public ResponseEntity<HttpStatus> deleteOpenLink(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long openLinkId) {
        openLinkService.deleteOpenLink(projectId, openLinkId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @Operation(description = "오픈 링크 공유 중지")
    @PutMapping("/{openLinkId}/close")
    public ResponseEntity<HttpStatus> closeOpenLink(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long openLinkId) {
        openLinkService.closeOpenLink(projectId, openLinkId);
        return new ResponseEntity<>(HttpStatus.OK);
    }


}

