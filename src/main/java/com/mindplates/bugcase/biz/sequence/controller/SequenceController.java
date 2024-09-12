package com.mindplates.bugcase.biz.sequence.controller;

import com.mindplates.bugcase.biz.sequence.dto.SequenceDTO;
import com.mindplates.bugcase.biz.sequence.dto.SequenceListDTO;
import com.mindplates.bugcase.biz.sequence.service.SequenceService;
import com.mindplates.bugcase.biz.sequence.vo.request.SequenceCreateRequest;
import com.mindplates.bugcase.biz.sequence.vo.response.SequenceListResponse;
import com.mindplates.bugcase.biz.sequence.vo.response.SequenceResponse;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/{spaceCode}/projects/{projectId}/sequences")
@AllArgsConstructor
public class SequenceController {

    private final SequenceService sequenceService;

    @Operation(description = "프로젝트의 케이스 시퀀스 목록 조회")
    @GetMapping("")
    public List<SequenceListResponse> selectSequences(@PathVariable String spaceCode, @PathVariable long projectId) {
        List<SequenceListDTO> sequenceList = sequenceService.selectProjectSequenceList(projectId);
        return sequenceList
            .stream()
            .map(SequenceListResponse::new)
            .collect(Collectors.toList());
    }

    @Operation(description = "케이스 시퀀스 조회")
    @GetMapping("/{sequenceId}")
    public SequenceResponse selectSequence(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long sequenceId) {
        SequenceDTO sequence = sequenceService.selectSequenceInfo(sequenceId);
        return new SequenceResponse(sequence);
    }

    @Operation(description = "릴리스 생성")
    @PostMapping("")
    public SequenceResponse createSequence(
        @PathVariable String spaceCode,
        @PathVariable long projectId,
        @Valid @RequestBody SequenceCreateRequest sequenceCreateRequest) {
        SequenceDTO sequence = sequenceCreateRequest.toDTO(projectId);
        return new SequenceResponse(sequenceService.createSequenceInfo(spaceCode, projectId, sequence));
    }



    /*


    @Operation(description = "릴리스 수정")
    @PutMapping("/{releaseId}")
    public ProjectReleaseResponse updateProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId,
        @Valid @RequestBody ProjectReleaseCreateRequest projectReleaseCreateRequest) {
        ProjectReleaseDTO projectRelease = projectReleaseService.updateProjectRelease(spaceCode, projectId, releaseId, projectReleaseCreateRequest.toDTO(projectId));
        return new ProjectReleaseResponse(projectRelease, SessionUtil.getUserId(true));
    }

    @Operation(description = "릴리스 삭제")
    @DeleteMapping("/{releaseId}")
    public void deleteProjectRelease(@PathVariable String spaceCode, @PathVariable long projectId, @PathVariable long releaseId) {
        projectReleaseService.deleteProjectRelease(spaceCode, projectId, releaseId);
    }
    */

}
