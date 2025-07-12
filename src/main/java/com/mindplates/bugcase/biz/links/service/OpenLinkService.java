package com.mindplates.bugcase.biz.links.service;

import com.mindplates.bugcase.biz.links.dto.OpenLinkDTO;
import com.mindplates.bugcase.biz.links.entity.OpenLink;
import com.mindplates.bugcase.biz.links.repository.OpenLinkRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenLinkService {

    private final OpenLinkRepository openLinkRepository;


    public List<OpenLinkDTO> selectOpenLinkList(long projectId) {
        List<OpenLink> openLinks = openLinkRepository.findByProjectIdOrderByIdDesc(projectId);
        return openLinks.stream().map(OpenLinkDTO::new).collect(Collectors.toList());
    }

    public OpenLinkDTO selectOpenLinkInfo(long projectId, long openLinkId) {
        OpenLink openLink = openLinkRepository.findByIdAndProjectId(openLinkId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new OpenLinkDTO(openLink, true);
    }

    public void deleteOpenLink(long projectId, long openLinkId) {
        OpenLink openLink = openLinkRepository.findByIdAndProjectId(openLinkId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        openLinkRepository.delete(openLink);
    }


    public OpenLinkDTO selectOpenLinkInfoByToken(String token) {
        OpenLink openLink = openLinkRepository.findByToken(token).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if (!openLink.isOpened()) {
            throw new ServiceException(HttpStatus.GONE, "error.openlink.closed");
        }

        if (openLink.getOpenEndDateTime() != null && openLink.getOpenEndDateTime().isBefore(LocalDateTime.now())) {
            throw new ServiceException(HttpStatus.GONE, "error.openlink.expired");
        }

        return new OpenLinkDTO(openLink, true);
    }

    @Transactional
    public OpenLinkDTO createOpenLink(long projectId, OpenLinkDTO info) {
        OpenLink openLink = info.toEntity();
        String uuid1 = UUID.randomUUID().toString();
        String uuid2 = UUID.randomUUID().toString();
        String token = uuid1 + uuid2;
        openLink.setToken(token.replace("-", ""));
        return new OpenLinkDTO(openLinkRepository.save(openLink));
    }

    @Transactional
    public void closeOpenLink(long projectId, long openLinkId) {
        OpenLink openLink = openLinkRepository.findByIdAndProjectId(openLinkId, projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        openLink.setOpened(false);
        openLinkRepository.save(openLink);
    }


}
