package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.notification.service.NotificationService;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceUserRepository;
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
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Slf4j
public class SpaceService {

    private final SpaceRepository spaceRepository;
    private final SpaceUserRepository spaceUserRepository;
    private final ProjectService projectService;
    private final NotificationService notificationService;
    private final MappingUtil mappingUtil;

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


    @CacheEvict(key = "#space.code", value = CacheConfig.SPACE)
    @Transactional
    public void deleteSpaceInfo(SpaceDTO space) {
        List<ProjectDTO> projects = projectService.selectSpaceProjectList(space.getId());
        for (ProjectDTO project : projects) {
            projectService.deleteProjectInfo(space.getCode(), project);
        }
        spaceRepository.deleteById(space.getId());
    }


    @CacheEvict(key = "#createSpaceInfo.code", value = CacheConfig.SPACE)
    @Transactional
    public SpaceDTO createSpaceInfo(SpaceDTO createSpaceInfo, Long userId) {
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

        updateSpaceInfo.getUsers().forEach((spaceUser -> {
            if ("D".equals(spaceUser.getCrud())) {
                spaceInfo.getUsers().removeIf((currentUser -> currentUser.getId().equals(spaceUser.getId())));
                spaceInfo.getApplicants().removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(spaceUser.getUser().getId())));
                notificationService.createNotificationInfoToUser(NotificationTargetCode.SPACE, spaceInfo.getId(), spaceUser.getUser().getId(), "관리자에 의해 '" + spaceInfo.getName() + "'" + " 스페이스에서 제외되었습니다.", "/spaces/" + spaceInfo.getCode() + "/info");
            } else if ("U".equals(spaceUser.getCrud())) {
                SpaceUserDTO updateUser = spaceInfo.getUsers().stream().filter((currentUser -> currentUser.getId().equals(spaceUser.getId()))).findAny().orElse(null);

                if (updateUser != null) {
                    if (!updateUser.getRole().equals(spaceUser.getRole())) {
                        notificationService.createNotificationInfoToUser(NotificationTargetCode.SPACE, spaceInfo.getId(), spaceUser.getUser().getId(), "관리자에 의해 '" + spaceInfo.getName() + "'" + " 스페이스의 권한(" + spaceUser.getRole() + ")이 변경되었습니다.", "/spaces/" + spaceInfo.getCode() + "/info");
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

    public List<SpaceUserDTO> selectSpaceUserList(String spaceCode, String query) {
        if (StringUtils.isNotBlank(query)) {
            List<SpaceUser> spaceUserList = spaceUserRepository.findAllBySpaceCodeAndUserNameLikeOrSpaceCodeAndUserEmailLike(spaceCode, query + "%", spaceCode, query);
            return spaceUserList.stream().map(SpaceUserDTO::new).collect(Collectors.toList());
        }

        List<SpaceUser> spaceUserList = spaceUserRepository.findAllBySpaceCode(spaceCode);
        return spaceUserList.stream().map(SpaceUserDTO::new).collect(Collectors.toList());
    }

    public boolean selectIsSpaceMember(Long spaceId, Long userId) {
        return spaceUserRepository.existsBySpaceIdAndUserId(spaceId, userId);
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
        SpaceApplicantDTO targetApplicant = space.getApplicants().stream().filter(applicant -> applicant.getSpace().getId().equals(space.getId()) && applicant.getUser().getId().equals(spaceApplicant.getUser().getId())).findAny().orElse(null);

        if (targetApplicant == null) {
            targetApplicant = spaceApplicant;
            space.getApplicants().add(targetApplicant);
            targetApplicant.setSpace(space);
        } else {
            targetApplicant.setMessage(spaceApplicant.getMessage());
        }

        // 자동 참여 옵션이 켜진 스페이스
        if (space.isAllowAutoJoin()) {
            if (targetApplicant.getApprovalStatusCode() == null || targetApplicant.getApprovalStatusCode() != null && !ApprovalStatusCode.APPROVAL.equals(targetApplicant.getApprovalStatusCode())) {
                targetApplicant.setApprovalStatusCode(ApprovalStatusCode.APPROVAL);

                if (space.getUsers().stream().noneMatch(spaceUser -> spaceUser.getUser().getId().equals(spaceApplicant.getUser().getId()))) {
                    notificationService.createSpaceSelfJoinNotificationInfo(space, user.getUsername());
                    space.getUsers().add(SpaceUserDTO.builder().space(space).user(UserDTO.builder().id(targetApplicant.getUser().getId()).build()).role(UserRoleCode.USER).build());
                }
            }

        } else {
            if (ApprovalStatusCode.APPROVAL.equals(targetApplicant.getApprovalStatusCode())) {
                throw new ServiceException(HttpStatus.BAD_REQUEST, "already.member");
            } else if (ApprovalStatusCode.REQUEST.equals(targetApplicant.getApprovalStatusCode()) || ApprovalStatusCode.REQUEST_AGAIN.equals(targetApplicant.getApprovalStatusCode())) {
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
        SpaceApplicantDTO targetApplicant = space.getApplicants().stream().filter(applicant -> applicant.getId().equals(applicantId)).findAny().orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (approve) {
            targetApplicant.setApprovalStatusCode(ApprovalStatusCode.APPROVAL);

            if (space.getUsers().stream().noneMatch(spaceUser -> spaceUser.getUser().getId().equals(targetApplicant.getUser().getId()))) {
                notificationService.createSpaceJoinResultNotificationInfo(space, user.getUsername(), targetApplicant.getUser().getId(), true);
                space.getUsers().add(SpaceUserDTO.builder().space(space).user(UserDTO.builder().id(targetApplicant.getUser().getId()).build()).role(UserRoleCode.USER).build());
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
        boolean isSpaceAdmin = space.getUsers().stream().anyMatch((spaceUser -> spaceUser.getUser().getId().equals(userId) && spaceUser.getRole().equals(UserRoleCode.ADMIN)));
        SecurityUser user = SessionUtil.getSecurityUser();
        if (!(user.getId().equals(userId) || isSpaceAdmin)) {
            throw new ServiceException(HttpStatus.FORBIDDEN);
        }

        UserDTO targetUser = space.getUsers().stream().filter(spaceUser -> spaceUser.getUser().getId().equals(userId)).findAny().map(spaceUser -> spaceUser.getUser()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        space.getApplicants().removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(userId)));
        space.getUsers().removeIf((spaceUser -> spaceUser.getUser().getId().equals(userId)));

        boolean hasAdmin = space.getUsers().stream().anyMatch((spaceUser -> spaceUser.getRole().equals(UserRoleCode.ADMIN)));
        if (!hasAdmin) {
            throw new ServiceException(HttpStatus.BAD_GATEWAY, "no.space.admin.exist");
        }

        spaceRepository.save(mappingUtil.convert(space, Space.class));
        notificationService.createSpaceUserWithdrawInfo(space, targetUser.getName() + " [" + targetUser.getEmail() + "]");

    }

}
