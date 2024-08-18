package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.ai.dto.OpenAiModelDTO;
import com.mindplates.bugcase.biz.ai.service.OpenAIClientService;
import com.mindplates.bugcase.biz.notification.service.NotificationService;
import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.repository.ProjectMessageChannelRepository;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.dto.SpaceApplicantDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceUserDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.space.repository.SpaceApplicantRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileVariableRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceUserRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceVariableRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunMessageChannelRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.code.NotificationTargetCode;
import com.mindplates.bugcase.common.code.UserRoleCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.SecurityUser;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.ApplicationContext;
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
    private final MessageSourceAccessor messageSourceAccessor;
    private final SpaceVariableRepository spaceVariableRepository;
    private final SpaceProfileRepository spaceProfileRepository;
    private final SpaceProfileVariableRepository spaceProfileVariableRepository;
    private final ProjectMessageChannelRepository projectMessageChannelRepository;
    private final TestrunMessageChannelRepository testrunMessageChannelRepository;
    private final OpenAIClientService openAIClientService;
    private final SpaceApplicantRepository spaceApplicantRepository;
    private final ApplicationContext applicationContext;


    private boolean existByCode(String code) {
        return spaceRepository.existsByCode(code);
    }

    public List<SpaceDTO> selectSpaceList() {
        return spaceRepository.findAll().stream().map(SpaceDTO::new).collect(Collectors.toList());
    }

    public SpaceDTO selectSpaceInfo(Long id) {
        Space space = spaceRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceDTO(space);
    }

    public String selectSpaceCode(Long id) {
        return spaceRepository.findCodeById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }

    public String selectSpaceCodeByProjectId(Long projectId) {
        return spaceRepository.findCodeByProjectId(projectId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }

    public String selectSpaceName(String spaceCode) {
        return spaceRepository.findNameByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }

    @Cacheable(key = "#spaceCode", value = CacheConfig.SPACE)
    public SpaceDTO selectSpaceInfo(String spaceCode) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceDTO(space);
    }

    public Long selectSpaceIdByCode(String spaceCode) {
        return spaceRepository.findIdByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }


    @CacheEvict(key = "#space.code", value = CacheConfig.SPACE)
    @Transactional
    public void deleteSpaceInfo(SpaceDTO space) {
        List<ProjectDTO> projects = projectService.selectSpaceProjectDetailList(space.getId());
        for (ProjectDTO project : projects) {
            projectService.deleteProjectInfo(space.getCode(), project.getId());
        }

        // 자식으로 설정되어 있지 않은 데이터 삭제
        spaceVariableRepository.deleteBySpaceId(space.getId());
        spaceProfileRepository.deleteBySpaceId(space.getId());
        spaceProfileVariableRepository.deleteBySpaceId(space.getId());

        spaceRepository.deleteById(space.getId());
    }


    @CacheEvict(key = "#createSpaceInfo.code", value = CacheConfig.SPACE)
    @Transactional
    public SpaceDTO createSpaceInfo(SpaceDTO createSpaceInfo, Long userId) {

        // 스페이스 코드 중복 확인
        if (existByCode(createSpaceInfo.getCode())) {
            throw new ServiceException("error.space.code.duplicated");
        }

        // 생성한 사용자를 어드민으로 추가
        List<SpaceUserDTO> users = new ArrayList<SpaceUserDTO>();
        users.add(SpaceUserDTO.builder().space(createSpaceInfo).user(UserDTO.builder().id(userId).build()).role(UserRoleCode.ADMIN).build());
        createSpaceInfo.setUsers(users);

        // LLM 모델 동기화
        createSpaceInfo.getLlms().forEach((llm -> {
            if (LlmTypeCode.OPENAI.equals(llm.getLlmTypeCode())) {
                syncLlmModels(llm);
            }
        }));

        Space target = createSpaceInfo.toEntity();
        spaceRepository.save(target);
        return new SpaceDTO(target);
    }


    @CacheEvict(key = "#updateSpaceInfo.code", value = CacheConfig.SPACE)
    @Transactional
    public SpaceDTO updateSpaceInfo(SpaceDTO updateSpaceInfo) {

        boolean hasAdmin = updateSpaceInfo.getUsers().stream().filter((spaceUserDTO -> !"D".equals(spaceUserDTO.getCrud()))).anyMatch((spaceUser -> spaceUser.getRole().equals(UserRoleCode.ADMIN)));
        if (!hasAdmin) {
            throw new ServiceException(HttpStatus.BAD_GATEWAY, "at.least.one.space.admin");
        }

        SpaceDTO spaceInfo = this.selectSpaceInfo(updateSpaceInfo.getId());
        spaceInfo.setName(updateSpaceInfo.getName());
        spaceInfo.setDescription(updateSpaceInfo.getDescription());
        spaceInfo.setActivated(updateSpaceInfo.isActivated());
        spaceInfo.setToken(updateSpaceInfo.getToken());
        spaceInfo.setAllowAutoJoin(updateSpaceInfo.isAllowAutoJoin());
        spaceInfo.setAllowSearch(updateSpaceInfo.isAllowSearch());
        spaceInfo.setHolidays(updateSpaceInfo.getHolidays());
        spaceInfo.setCountry(updateSpaceInfo.getCountry());
        spaceInfo.setTimeZone(updateSpaceInfo.getTimeZone());

        // LLM 프롬프트 업데이트
        spaceInfo.updateLlmPrompts(updateSpaceInfo.getLlmPrompts());

        // LLM 설정 업데이트
        spaceInfo.updateLlms(updateSpaceInfo.getLlms());
        // 모델 업데이트
        spaceInfo.getLlms().forEach((llm -> {
            if (LlmTypeCode.OPENAI.equals(llm.getLlmTypeCode())) {
                syncLlmModels(llm);
            }
        }));

        // 메세지 채널 업데이트
        List<Long> deleteMessageChannelIds = spaceInfo.getRemoveTargetMessageChannels(updateSpaceInfo.getMessageChannels());
        deleteSpaceMessageChannels(deleteMessageChannelIds);
        spaceInfo.updateMessageChannels(updateSpaceInfo.getMessageChannels());

        // 추방 사용자 알림 발송
        List<Long> bannedUserIds = spaceInfo.getBannedUserIds(updateSpaceInfo.getUsers());
        String bannedMessage = messageSourceAccessor.getMessage("space.user.banned", new Object[]{spaceInfo.getName()});
        bannedUserIds.forEach((bannedUserId -> {
            notificationService.createNotificationInfoToUser(NotificationTargetCode.SPACE, spaceInfo.getId(), bannedUserId, bannedMessage, "/spaces/" + spaceInfo.getCode() + "/info");
        }));

        // 권한 변경 사용자 알림 발송
        List<Map<String, String>> roleChangedUserInfo = spaceInfo.getRoleChangedUsers(updateSpaceInfo.getUsers());
        roleChangedUserInfo.forEach((roleChangedUser -> {
            Long userId = Long.parseLong(roleChangedUser.get("userId"));
            String beforeRole = roleChangedUser.get("beforeRole");
            String afterRole = roleChangedUser.get("afterRole");
            String roleChangeMessage = messageSourceAccessor.getMessage("space.user.auth.changed", new Object[]{spaceInfo.getName(), beforeRole, afterRole});
            notificationService.createNotificationInfoToUser(NotificationTargetCode.SPACE, spaceInfo.getId(), userId, roleChangeMessage, "/spaces/" + spaceInfo.getCode() + "/info");
        }));

        // 사용자 업데이트
        spaceInfo.updateUsers(updateSpaceInfo.getUsers());

        Space space = spaceInfo.toEntity();
        Space updateSpaceResult = spaceRepository.save(space);
        return new SpaceDTO(updateSpaceResult);


    }

    public List<SpaceDTO> selectSearchAllowedSpaceList(String query, Long userId) {
        List<Space> spaceList = spaceRepository.findAllByNameLikeAndAllowSearchTrueOrCodeLikeAndAllowSearchTrue(query + "%", query + "%", userId);
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

        return spaceList.stream().map(SpaceDTO::new).collect(Collectors.toList());
    }

    public List<SpaceUserDTO> selectSpaceUserList(String spaceCode, String query) {
        if (StringUtils.isNotBlank(query)) {
            List<SpaceUser> spaceUserList = spaceUserRepository.findAllBySpaceCodeAndUserNameLikeOrSpaceCodeAndUserEmailLike(spaceCode, query);
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
    public void createOrUpdateSpaceApplicantInfo(String spaceCode, SpaceApplicantDTO spaceApplicant) {

        if (!spaceCode.equals(spaceApplicant.getSpace().getCode())) {
            throw new ServiceException(HttpStatus.BAD_REQUEST);
        }

        SecurityUser user = SessionUtil.getSecurityUser();
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        SpaceApplicant targetApplicant = space.getApplicants().stream()
            .filter(applicant -> applicant.getSpace().getId().equals(space.getId()) && applicant.getUser().getId().equals(spaceApplicant.getUser().getId())).findAny().orElse(null);

        if (targetApplicant == null) {
            targetApplicant = spaceApplicant.toEntity(space);
            space.getApplicants().add(targetApplicant);
        } else {
            targetApplicant.setMessage(spaceApplicant.getMessage());
        }

        SpaceDTO spaceDTO = new SpaceDTO(space);

        // 자동 참여 옵션이 켜진 스페이스
        if (space.isAllowAutoJoin()) {
            if (targetApplicant.getApprovalStatusCode() == null || !ApprovalStatusCode.APPROVAL.equals(targetApplicant.getApprovalStatusCode())) {
                targetApplicant.setApprovalStatusCode(ApprovalStatusCode.APPROVAL);

                if (space.getUsers().stream().noneMatch(spaceUser -> spaceUser.getUser().getId().equals(spaceApplicant.getUser().getId()))) {
                    notificationService.createSpaceSelfJoinNotificationInfo(spaceDTO, user.getUsername());
                    space.getUsers().add(SpaceUser.builder().space(space).user(User.builder().id(targetApplicant.getUser().getId()).build()).role(UserRoleCode.USER).build());
                }
            }

        } else {
            if (ApprovalStatusCode.APPROVAL.equals(targetApplicant.getApprovalStatusCode())) {
                throw new ServiceException(HttpStatus.BAD_REQUEST, "already.member");
            } else if (ApprovalStatusCode.REQUEST.equals(targetApplicant.getApprovalStatusCode()) || ApprovalStatusCode.REQUEST_AGAIN
                .equals(targetApplicant.getApprovalStatusCode())) {
                throw new ServiceException(HttpStatus.BAD_REQUEST, "already.requested");
            } else if (ApprovalStatusCode.REJECTED.equals(targetApplicant.getApprovalStatusCode())) {
                notificationService.createSpaceJoinAgainRequestNotificationInfo(spaceDTO, user.getUsername());
                targetApplicant.setApprovalStatusCode(ApprovalStatusCode.REQUEST_AGAIN);
            } else {
                notificationService.createSpaceJoinRequestNotificationInfo(spaceDTO, user.getUsername());
                targetApplicant.setApprovalStatusCode(ApprovalStatusCode.REQUEST);
            }
        }

        spaceRepository.save(space);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
    @Transactional
    public void deleteSpaceApplicantInfo(String spaceCode, Long userId) {
        SpaceService spaceService = applicationContext.getBean(SpaceService.class);
        SecurityUser user = SessionUtil.getSecurityUser();
        SpaceDTO space = spaceService.selectSpaceInfo(spaceCode);
        notificationService.createSpaceJoinRequestCancelNotificationInfo(space, user.getUsername());
        spaceApplicantRepository.deleteBySpaceIdAndUserId(space.getId(), userId);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
    @Transactional
    public void updateSpaceApplicantStatus(String spaceCode, Long applicantId, boolean approve) {

        SecurityUser user = SessionUtil.getSecurityUser();

        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        SpaceApplicant targetApplicant = space.getApplicants().stream().filter(applicant -> applicant.getId().equals(applicantId)).findAny()
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        if (approve) {
            targetApplicant.setApprovalStatusCode(ApprovalStatusCode.APPROVAL);

            if (space.getUsers().stream().noneMatch(spaceUser -> spaceUser.getUser().getId().equals(targetApplicant.getUser().getId()))) {
                notificationService.createSpaceJoinResultNotificationInfo(new SpaceDTO(space), user.getUsername(), targetApplicant.getUser().getId(), true);
                space.getUsers().add(SpaceUser.builder().space(space).user(User.builder().id(targetApplicant.getUser().getId()).build()).role(UserRoleCode.USER).build());
            }
        } else {
            notificationService.createSpaceJoinResultNotificationInfo(new SpaceDTO(space), user.getUsername(), targetApplicant.getUser().getId(), false);
            targetApplicant.setApprovalStatusCode(ApprovalStatusCode.REJECTED);
        }

        spaceRepository.save(space);

    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
    @Transactional
    public void leaveSpace(String spaceCode, Long userId) {
        Space space = spaceRepository.findByCode(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        boolean hasAdmin = space.getUsers().stream().anyMatch((spaceUser -> spaceUser.getRole().equals(UserRoleCode.ADMIN) && !spaceUser.getUser().getId().equals(userId)));
        if (!hasAdmin) {
            throw new ServiceException(HttpStatus.BAD_GATEWAY, "no.space.admin.exist");
        }

        User targetUser = space.getUsers().stream().filter(spaceUser -> spaceUser.getUser().getId().equals(userId)).findAny().map(SpaceUser::getUser)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        space.getApplicants().removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(userId)));
        space.getUsers().removeIf((spaceUser -> spaceUser.getUser().getId().equals(userId)));
        spaceRepository.save(space);
        notificationService.createSpaceUserWithdrawInfo(new SpaceDTO(space), targetUser.getName() + " [" + targetUser.getEmail() + "]");
    }

    public List<SpaceMessageChannelDTO> selectSpaceMessageChannels(String spaceCode) {
        SpaceService spaceService = applicationContext.getBean(SpaceService.class);
        SpaceDTO space = spaceService.selectSpaceInfo(spaceCode);
        return space.getMessageChannels();
    }

    private void syncLlmModels(LlmDTO llm) {
        if (llm.getOpenAi().getModels() == null) {
            llm.getOpenAi().setModels(new ArrayList<>());
        }

        try {
            List<String> models = openAIClientService.getModelList(llm.getOpenAi().getUrl(), llm.getOpenAi().getApiKey());
            if (llm.getId() != null) {
                // targetLlm의 model에는 있는 code인데, modeCodes에 없다면 제거
                llm.getOpenAi().getModels().removeIf((model -> models.stream().noneMatch((modelCode -> model.getCode().equals(modelCode)))));
            }

            // targetLlm의 model의 code와 modelCodes가 일치하지 않는 것만 추가
            models.stream().filter((modelCode -> llm.getOpenAi().getModels().stream().noneMatch((model -> model.getCode().equals(modelCode)))))
                .forEach((modelCode -> {
                    llm.getOpenAi().getModels().add(OpenAiModelDTO.builder()
                        .name(modelCode)
                        .code(modelCode)
                        .openAi(llm.getOpenAi())
                        .build());
                }));
        } catch (Exception e) {
            throw new ServiceException("llm.fail.to.get.models", new String[]{e.getMessage()});
        }

    }

    private void deleteSpaceMessageChannels(List<Long> deleteMessageChannelIds) {
        deleteMessageChannelIds.forEach((deleteSpaceMessageChannelId -> {
            projectMessageChannelRepository.findAllByMessageChannelId(deleteSpaceMessageChannelId).forEach((projectMessageChannel -> {
                testrunMessageChannelRepository.deleteByProjectMessageChannelId(projectMessageChannel.getId());
            }));
            projectMessageChannelRepository.deleteBySpaceMessageChannelId(deleteSpaceMessageChannelId);
        }));
    }

    @Transactional
    public void deleteSpaceUser(long userId) {
        spaceApplicantRepository.deleteByUserId(userId);
        spaceUserRepository.deleteByUserId(userId);
    }


}
