package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.notification.service.NotificationService;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.biz.project.repository.ProjectMessageChannelRepository;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelHeaderDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelPayloadDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.space.repository.SpaceMessageChannelRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileVariableRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceUserRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceVariableRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunMessageChannelRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.code.NotificationTargetCode;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.SecurityUser;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final SpaceUserRepository spaceUserRepository;
    private final ProjectService projectService;
    private final NotificationService notificationService;
    private final MappingUtil mappingUtil;
    private final MessageSourceAccessor messageSourceAccessor;
    private final SpaceVariableRepository spaceVariableRepository;
    private final SpaceProfileRepository spaceProfileRepository;
    private final SpaceProfileVariableRepository spaceProfileVariableRepository;
    private final SpaceMessageChannelRepository spaceMessageChannelRepository;
    private final ProjectMessageChannelRepository projectMessageChannelRepository;
    private final TestrunMessageChannelRepository testrunMessageChannelRepository;

    private boolean existByCode(String code) {
        Long count = spaceRepository.countByCode(code);
        return count > 0;
    }

    public List<SpaceDTO> selectSpaceList() {
        List<Space> spaceList = spaceRepository.findAll();
        List<SpaceDTO> result = spaceList.stream().map(SpaceDTO::new).collect(Collectors.toList());

        result.forEach((space -> {
            Long projectCount = projectService.selectSpaceProjectCount(space.getId());
            space.setProjectCount(projectCount);
        }));

        return result;
    }

    public SpaceDTO selectSpaceInfo(Long id) {
        Space space = spaceRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceDTO(space);
    }


    @Cacheable(key = "#spaceCode", value = CacheConfig.SPACE)
    public SpaceDTO selectSpaceInfo(String spaceCode) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceDTO(space);
    }

    public Long selectSpaceIdByCode(String spaceCode) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return space.getId();
    }


    @CacheEvict(key = "#space.code", value = CacheConfig.SPACE)
    @Transactional
    public void deleteSpaceInfo(SpaceDTO space) {
        List<ProjectDTO> projects = projectService.selectSpaceProjectDetailList(space.getId());
        for (ProjectDTO project : projects) {
            projectService.deleteProjectInfo(space.getCode(), project);
        }

        spaceVariableRepository.deleteBySpaceId(space.getId());
        spaceProfileRepository.deleteBySpaceId(space.getId());
        spaceProfileVariableRepository.deleteBySpaceId(space.getId());

        spaceRepository.deleteById(space.getId());
    }


    @CacheEvict(key = "#createSpaceInfo.code", value = CacheConfig.SPACE)
    @Transactional
    public SpaceDTO createSpaceInfo(SpaceDTO createSpaceInfo, Long userId) {

        if (existByCode(createSpaceInfo.getCode())) {
            throw new ServiceException("error.space.code.duplicated");
        }

        Space spaceInfo = mappingUtil.convert(createSpaceInfo, Space.class);
        SpaceUser spaceUser = SpaceUser.builder().space(spaceInfo).user(User.builder().id(userId).build()).role(UserRoleCode.ADMIN).build();
        spaceInfo.setUsers(Arrays.asList(spaceUser));
        spaceRepository.save(spaceInfo);
        return new SpaceDTO(spaceInfo);
    }


    @CacheEvict(key = "#updateSpaceInfo.code", value = CacheConfig.SPACE)
    @Transactional
    public SpaceDTO updateSpaceInfo(SpaceDTO updateSpaceInfo) {
        SpaceDTO spaceInfo = this.selectSpaceInfo(updateSpaceInfo.getId());
        spaceInfo.setName(updateSpaceInfo.getName());
        spaceInfo.setDescription(updateSpaceInfo.getDescription());
        spaceInfo.setActivated(updateSpaceInfo.isActivated());
        spaceInfo.setToken(updateSpaceInfo.getToken());
        spaceInfo.setAllowAutoJoin(updateSpaceInfo.isAllowAutoJoin());
        spaceInfo.setHolidays(updateSpaceInfo.getHolidays());
        spaceInfo.setCountry(updateSpaceInfo.getCountry());
        spaceInfo.setTimeZone(updateSpaceInfo.getTimeZone());

        if (updateSpaceInfo.getMessageChannels() == null || updateSpaceInfo.getMessageChannels().isEmpty()) {
            if (!spaceInfo.getMessageChannels().isEmpty()) {
                spaceInfo.getMessageChannels().clear();
            }
        } else {


            List<Long> deleteMessageChannelIds = spaceInfo.getMessageChannels().stream()
                .filter((spaceMessageChannel -> updateSpaceInfo.getMessageChannels().stream()
                    .noneMatch((updateMessageChannel -> updateMessageChannel.getId().equals(spaceMessageChannel.getId())))))
                .map(SpaceMessageChannelDTO::getId)
                .collect(Collectors.toList());

            spaceInfo.getMessageChannels().removeIf((projectMessageChannel -> deleteMessageChannelIds.contains(projectMessageChannel.getId())));

            // deleteMessageChannelIds에 있는 ID를 가진 testrunMessageChannel 삭제
            deleteMessageChannelIds.forEach((deleteSpaceMessageChannelId -> {
                projectMessageChannelRepository.findAllByMessageChannelId(deleteSpaceMessageChannelId).forEach((projectMessageChannel -> {
                    testrunMessageChannelRepository.deleteByProjectMessageChannelId(projectMessageChannel.getId());
                }));
                projectMessageChannelRepository.deleteBySpaceMessageChannelId(deleteSpaceMessageChannelId);
            }));

            updateSpaceInfo.getMessageChannels().forEach((updateChannel -> {
                if (updateChannel.getId() == null) {
                    spaceInfo.getMessageChannels().add(updateChannel);
                } else {
                    SpaceMessageChannelDTO targetChannel = spaceInfo.getMessageChannels().stream().filter((channel -> channel.getId().equals(updateChannel.getId()))).findAny().orElse(null);
                    if (targetChannel != null) {
                        targetChannel.setName(updateChannel.getName());
                        targetChannel.setUrl(updateChannel.getUrl());
                        targetChannel.setHttpMethod(updateChannel.getHttpMethod());
                        targetChannel.setMessageChannelType(updateChannel.getMessageChannelType());
                        targetChannel.setPayloadType(updateChannel.getPayloadType());
                        targetChannel.setJson(updateChannel.getJson());

                        // updateChannel의 header를 id가 존재하는지에 따라 업데이터 및 추가 처리
                        targetChannel.getHeaders().removeIf((header -> updateChannel.getHeaders().stream().noneMatch((updateHeader -> updateHeader.getId().equals(header.getId())))));
                        updateChannel.getHeaders().forEach((updateHeader -> {
                            if (updateHeader.getId() == null) {
                                targetChannel.getHeaders().add(updateHeader);
                            } else {
                                SpaceMessageChannelHeaderDTO targetHeader = targetChannel.getHeaders().stream().filter((header -> header.getId().equals(updateHeader.getId()))).findAny().orElse(null);
                                if (targetHeader != null) {
                                    targetHeader.setDataKey(updateHeader.getDataKey());
                                    targetHeader.setDataValue(updateHeader.getDataValue());
                                }
                            }
                        }));

                        // updateChannel의 payloads를 id가 존재하는지에 따라 업데이터 및 추가 처리
                        targetChannel.getPayloads().removeIf((payload -> updateChannel.getPayloads().stream().noneMatch((updatePayload -> updatePayload.getId().equals(payload.getId())))));
                        updateChannel.getPayloads().forEach((updatePayload -> {
                            if (updatePayload.getId() == null) {
                                targetChannel.getPayloads().add(updatePayload);
                            } else {
                                SpaceMessageChannelPayloadDTO targetPayload = targetChannel.getPayloads().stream().filter((payload -> payload.getId().equals(updatePayload.getId()))).findAny().orElse(null);
                                if (targetPayload != null) {
                                    targetPayload.setDataKey(updatePayload.getDataKey());
                                    targetPayload.setDataValue(updatePayload.getDataValue());
                                }
                            }
                        }));

                    }
                }
            }));
        }

        updateSpaceInfo.getUsers().forEach((spaceUser -> {
            if ("D".equals(spaceUser.getCrud())) {
                spaceInfo.getUsers().removeIf((currentUser -> currentUser.getId().equals(spaceUser.getId())));
                spaceInfo.getApplicants().removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(spaceUser.getUser().getId())));

                String message = messageSourceAccessor.getMessage("space.user.banned", new Object[]{spaceInfo.getName()});
                notificationService.createNotificationInfoToUser(NotificationTargetCode.SPACE, spaceInfo.getId(), spaceUser.getUser().getId(),
                    message, "/spaces/" + spaceInfo.getCode() + "/info");
            } else if ("U".equals(spaceUser.getCrud())) {
                SpaceUserDTO updateUser = spaceInfo.getUsers().stream().filter((currentUser -> currentUser.getId().equals(spaceUser.getId())))
                    .findAny().orElse(null);

                if (updateUser != null) {
                    if (!updateUser.getRole().equals(spaceUser.getRole())) {

                        String message = messageSourceAccessor.getMessage("space.user.auth.changed",
                            new Object[]{spaceInfo.getName(), updateUser.getRole(), spaceUser.getRole()});

                        notificationService.createNotificationInfoToUser(NotificationTargetCode.SPACE, spaceInfo.getId(), spaceUser.getUser().getId(),
                            message,
                            "/spaces/" + spaceInfo.getCode() + "/info");
                    }
                    updateUser.setRole(spaceUser.getRole());
                }
            }
        }));

        boolean hasAdmin = spaceInfo.getUsers().stream().anyMatch((spaceUser -> spaceUser.getRole().equals(UserRoleCode.ADMIN)));
        if (!hasAdmin) {
            throw new ServiceException(HttpStatus.BAD_GATEWAY, "at.least.one.space.admin");
        }

        Space updateSpaceResult = spaceRepository.save(mappingUtil.convert(spaceInfo, Space.class));

        return new SpaceDTO(updateSpaceResult);
    }

    public List<SpaceDTO> selectSearchAllowedSpaceList(String query) {
        List<Space> spaceList = spaceRepository.findAllByNameLikeAndAllowSearchTrueOrCodeLikeAndAllowSearchTrue(query + "%", query + "%");
        return spaceList.stream().map(SpaceDTO::new).collect(Collectors.toList());
    }

    public List<SpaceDTO> selectUserSpaceList(Long userId) {
        List<Space> spaceList = spaceRepository.findAllByUsersUserId(userId);
        List<SpaceDTO> result = spaceList.stream().map(SpaceDTO::new).collect(Collectors.toList());

        result.forEach((space -> {
            Long projectCount = projectService.selectSpaceProjectCount(space.getId());
            space.setProjectCount(projectCount);
        }));

        return result;

    }

    public List<SpaceDTO> selectUserSpaceList(Long userId, String query) {
        List<Space> spaceList;
        if (StringUtils.isBlank(query)) {
            spaceList = spaceRepository.findAllByUsersUserId(userId);
        } else {
            spaceList = spaceRepository.findAllByUsersUserIdAndNameContainingIgnoreCase(userId, query);
        }

        List<SpaceDTO> result = spaceList.stream().map(SpaceDTO::new).collect(Collectors.toList());

        result.forEach((space -> {
            Long projectCount = projectService.selectSpaceProjectCount(space.getId());
            space.setProjectCount(projectCount);
        }));

        return result;

    }

    public List<SpaceUserDTO> selectSpaceUserList(String spaceCode, String query) {
        if (StringUtils.isNotBlank(query)) {
            List<SpaceUser> spaceUserList = spaceUserRepository
                .findAllBySpaceCodeAndUserNameLikeOrSpaceCodeAndUserEmailLike(spaceCode, query + "%", spaceCode, query);
            return spaceUserList.stream().map(SpaceUserDTO::new).collect(Collectors.toList());
        }

        List<SpaceUser> spaceUserList = spaceUserRepository.findAllBySpaceCode(spaceCode);
        return spaceUserList.stream().map(SpaceUserDTO::new).collect(Collectors.toList());
    }

    public boolean selectIsSpaceAdmin(Long spaceId, Long userId) {
        return spaceUserRepository.existsBySpaceIdAndUserIdAndRole(spaceId, userId, UserRoleCode.ADMIN);
    }

    public boolean selectIsSpaceMember(String spaceCode, Long userId) {
        return spaceUserRepository.existsBySpaceCodeAndUserId(spaceCode, userId);
    }

    public boolean selectIsSpaceAdmin(String spaceCode, Long userId) {
        return spaceUserRepository.existsBySpaceCodeAndUserIdAndRole(spaceCode, userId, UserRoleCode.ADMIN);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
    @Transactional
    public SpaceDTO createOrUpdateSpaceApplicantInfo(String spaceCode, SpaceApplicantDTO spaceApplicant) {
        SecurityUser user = SessionUtil.getSecurityUser();
        SpaceDTO space = this.selectSpaceInfo(spaceApplicant.getSpace().getCode());
        SpaceApplicantDTO targetApplicant = space.getApplicants().stream().filter(
                applicant -> applicant.getSpace().getId().equals(space.getId()) && applicant.getUser().getId().equals(spaceApplicant.getUser().getId()))
            .findAny().orElse(null);

        if (targetApplicant == null) {
            targetApplicant = spaceApplicant;
            space.getApplicants().add(targetApplicant);
            targetApplicant.setSpace(space);
        } else {
            targetApplicant.setMessage(spaceApplicant.getMessage());
        }

        // 자동 참여 옵션이 켜진 스페이스
        if (space.isAllowAutoJoin()) {
            if (targetApplicant.getApprovalStatusCode() == null || targetApplicant.getApprovalStatusCode() != null && !ApprovalStatusCode.APPROVAL
                .equals(targetApplicant.getApprovalStatusCode())) {
                targetApplicant.setApprovalStatusCode(ApprovalStatusCode.APPROVAL);

                if (space.getUsers().stream().noneMatch(spaceUser -> spaceUser.getUser().getId().equals(spaceApplicant.getUser().getId()))) {
                    notificationService.createSpaceSelfJoinNotificationInfo(space, user.getUsername());
                    space.getUsers().add(SpaceUserDTO.builder().space(space).user(UserDTO.builder().id(targetApplicant.getUser().getId()).build())
                        .role(UserRoleCode.USER).build());
                }
            }

        } else {
            if (ApprovalStatusCode.APPROVAL.equals(targetApplicant.getApprovalStatusCode())) {
                throw new ServiceException(HttpStatus.BAD_REQUEST, "already.member");
            } else if (ApprovalStatusCode.REQUEST.equals(targetApplicant.getApprovalStatusCode()) || ApprovalStatusCode.REQUEST_AGAIN
                .equals(targetApplicant.getApprovalStatusCode())) {
                throw new ServiceException(HttpStatus.BAD_REQUEST, "already.requested");
            } else if (ApprovalStatusCode.REJECTED.equals(targetApplicant.getApprovalStatusCode())) {
                notificationService.createSpaceJoinAgainRequestNotificationInfo(space, user.getUsername());
                targetApplicant.setApprovalStatusCode(ApprovalStatusCode.REQUEST_AGAIN);
            } else {
                notificationService.createSpaceJoinRequestNotificationInfo(space, user.getUsername());
                targetApplicant.setApprovalStatusCode(ApprovalStatusCode.REQUEST);
            }
        }

        Space result = spaceRepository.save(mappingUtil.convert(space, Space.class));
        return new SpaceDTO(result);
    }


    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
    @Transactional
    public void deleteSpaceApplicantInfo(String spaceCode, Long userId) {
        SecurityUser user = SessionUtil.getSecurityUser();
        SpaceDTO space = this.selectSpaceInfo(spaceCode);
        notificationService.createSpaceJoinRequestCancelNotificationInfo(space, user.getUsername());
        space.getApplicants().removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(userId)));
        spaceRepository.save(mappingUtil.convert(space, Space.class));
    }


    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
    @Transactional
    public SpaceDTO updateSpaceApplicantStatus(String spaceCode, Long applicantId, boolean approve) {

        SecurityUser user = SessionUtil.getSecurityUser();
        SpaceDTO space = this.selectSpaceInfo(spaceCode);
        SpaceApplicantDTO targetApplicant = space.getApplicants().stream().filter(applicant -> applicant.getId().equals(applicantId)).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (approve) {
            targetApplicant.setApprovalStatusCode(ApprovalStatusCode.APPROVAL);

            if (space.getUsers().stream().noneMatch(spaceUser -> spaceUser.getUser().getId().equals(targetApplicant.getUser().getId()))) {
                notificationService.createSpaceJoinResultNotificationInfo(space, user.getUsername(), targetApplicant.getUser().getId(), true);
                space.getUsers().add(
                    SpaceUserDTO.builder().space(space).user(UserDTO.builder().id(targetApplicant.getUser().getId()).build()).role(UserRoleCode.USER)
                        .build());
            }


        } else {
            notificationService.createSpaceJoinResultNotificationInfo(space, user.getUsername(), targetApplicant.getUser().getId(), false);
            targetApplicant.setApprovalStatusCode(ApprovalStatusCode.REJECTED);
        }

        Space result = spaceRepository.save(mappingUtil.convert(space, Space.class));

        return new SpaceDTO(result);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
    @Transactional
    public void deleteSpaceUser(String spaceCode, Long userId) {
        SpaceDTO space = this.selectSpaceInfo(spaceCode);
        boolean isSpaceAdmin = space.getUsers().stream()
            .anyMatch((spaceUser -> spaceUser.getUser().getId().equals(userId) && spaceUser.getRole().equals(UserRoleCode.ADMIN)));
        SecurityUser user = SessionUtil.getSecurityUser();
        if (!(user.getId().equals(userId) || isSpaceAdmin)) {
            throw new ServiceException(HttpStatus.FORBIDDEN);
        }

        UserDTO targetUser = space.getUsers().stream().filter(spaceUser -> spaceUser.getUser().getId().equals(userId)).findAny()
            .map(spaceUser -> spaceUser.getUser()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        space.getApplicants().removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(userId)));
        space.getUsers().removeIf((spaceUser -> spaceUser.getUser().getId().equals(userId)));

        boolean hasAdmin = space.getUsers().stream().anyMatch((spaceUser -> spaceUser.getRole().equals(UserRoleCode.ADMIN)));
        if (!hasAdmin) {
            throw new ServiceException(HttpStatus.BAD_GATEWAY, "no.space.admin.exist");
        }

        spaceRepository.save(mappingUtil.convert(space, Space.class));
        notificationService.createSpaceUserWithdrawInfo(space, targetUser.getName() + " [" + targetUser.getEmail() + "]");

    }

    public List<SpaceMessageChannelDTO> selectSpaceMessageChannels(String spaceCode) {
        List<SpaceMessageChannel> spaceMessageChannels = spaceMessageChannelRepository.findAllBySpaceCode(spaceCode);
        return spaceMessageChannels.stream().map(SpaceMessageChannelDTO::new).collect(Collectors.toList());
    }

}
