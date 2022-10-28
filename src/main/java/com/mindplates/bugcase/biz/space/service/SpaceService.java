package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.notification.service.NotificationService;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.space.repository.SpaceApplicantRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceUserRepository;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.ApprovalStatusCode;
import com.mindplates.bugcase.common.entity.UserRole;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.SessionUtil;
import com.mindplates.bugcase.common.vo.SecurityUser;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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

  private final SpaceApplicantRepository spaceApplicantRepository;

  public Optional<Space> selectSpaceInfo(Long id) {
    return spaceRepository.findById(id);
  }


  @Cacheable(key = "#code", value = CacheConfig.SPACE)
  public Optional<Space> selectSpaceInfo(String code) {
    return spaceRepository.findByCode(code);
  }


  @Caching(evict = {
      @CacheEvict(key = "#space.code", value = CacheConfig.SPACE),
      // @CacheEvict(key = "'all-space-list'", value = CacheConfig.SPACE)
  })
  @Transactional
  public void deleteSpaceInfo(Space space) {
    List<Project> projects = projectService.selectSpaceProjectList(space.getId());
    for (Project project : projects) {
      projectService.deleteProjectInfo(space.getCode(), project);
    }
    spaceRepository.deleteById(space.getId());
  }


  @Caching(evict = {
      @CacheEvict(key = "#space.code", value = CacheConfig.SPACE),
      // @CacheEvict(key = "'all-space-list'", value = CacheConfig.SPACE)
  })
  @Transactional
  public Space createSpaceInfo(Space space, Long userId) {
    SpaceUser spaceUser = SpaceUser.builder().space(space).user(User.builder().id(userId).build()).role(UserRole.ADMIN).build();
    space.setUsers(Arrays.asList(spaceUser));
    spaceRepository.save(space);
    return space;
  }

  @Caching(evict = {
      @CacheEvict(key = "#next.code", value = CacheConfig.SPACE),
      // @CacheEvict(key = "'all-space-list'", value = CacheConfig.SPACE)
  })
  @Transactional
  public Space updateSpaceInfo(Space next) {
    Space space = this.selectSpaceInfo(next.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    space.merge(next);
    spaceRepository.save(space);
    return space;
  }


  // @Cacheable(key = "'all-space-list'", value = CacheConfig.SPACE)
  public List<Space> selectSearchAllowedSpaceList(String query) {
    return spaceRepository.findAllByNameLikeAndAllowSearchTrueOrCodeLikeAndAllowSearchTrue(query + "%", query + "%");
  }

  public List<Space> selectUserSpaceList(Long userId) {
    return spaceRepository.findAllByUsersUserId(userId);
  }

  public List<SpaceUser> selectSpaceUserList(String spaceCode, String query) {
    if (StringUtils.isNotBlank(query)) {
      return spaceUserRepository.findAllBySpaceCodeAndUserNameLikeOrSpaceCodeAndUserEmailLike(spaceCode, query + "%", spaceCode, query);
    }

    return spaceUserRepository.findAllBySpaceCode(spaceCode);

  }

  public boolean selectIsSpaceMember(Long spaceId, Long userId) {
    return spaceUserRepository.existsBySpaceIdAndUserId(spaceId, userId);
  }

  public boolean selectIsSpaceAdmin(Long spaceId, Long userId) {
    return spaceUserRepository.existsBySpaceIdAndUserIdAndRole(spaceId, userId, UserRole.ADMIN);
  }

  public boolean selectIsSpaceMember(String spaceCode, Long userId) {
    return spaceUserRepository.existsBySpaceCodeAndUserId(spaceCode, userId);
  }

  public boolean selectIsSpaceAdmin(String spaceCode, Long userId) {
    return spaceUserRepository.existsBySpaceCodeAndUserIdAndRole(spaceCode, userId, UserRole.ADMIN);
  }

  @Caching(evict = {
      @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE),
      // @CacheEvict(key = "'all-space-list'", value = CacheConfig.SPACE)
  })
  @Transactional
  public Space createOrUpdateSpaceApplicantInfo(String spaceCode, SpaceApplicant spaceApplicant) {
    SecurityUser user = SessionUtil.getSecurityUser();
    Space space = this.selectSpaceInfo(spaceApplicant.getSpace().getCode()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    SpaceApplicant targetApplicant = space.getApplicants().stream().filter(applicant -> applicant.getSpace().getId().equals(space.getId()) && applicant.getUser().getId().equals(spaceApplicant.getUser().getId())).findAny().orElse(null);

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
          space.getUsers()
              .add(SpaceUser.builder()
                  .space(space)
                  .user(User.builder().id(targetApplicant.getUser().getId()).build())
                  .role(UserRole.USER)
                  .build());
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

    spaceRepository.save(space);

    return space;
  }

  @Caching(evict = {
      @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
  })
  @Transactional
  public void deleteSpaceApplicantInfo(String spaceCode, Long userId) {
    SecurityUser user = SessionUtil.getSecurityUser();
    Space space = this.selectSpaceInfo(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    notificationService.createSpaceJoinRequestCancelNotificationInfo(space, user.getUsername());
    space.getApplicants().removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(userId)));
    spaceRepository.save(space);

  }


  @Caching(evict = {
      @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE)
  })
  @Transactional
  public Space updateSpaceApplicantStatus(String spaceCode, Long applicantId, boolean approve) {

    SecurityUser user = SessionUtil.getSecurityUser();
    Space space = this.selectSpaceInfo(spaceCode).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    SpaceApplicant targetApplicant = space.getApplicants().stream().filter(applicant -> applicant.getId().equals(applicantId)).findAny().orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

    if (approve) {
      targetApplicant.setApprovalStatusCode(ApprovalStatusCode.APPROVAL);

      if (space.getUsers().stream().noneMatch(spaceUser -> spaceUser.getUser().getId().equals(targetApplicant.getUser().getId()))) {
        notificationService.createSpaceJoinResultNotificationInfo(space, user.getUsername(), targetApplicant.getUser().getId(), true);
        space.getUsers()
            .add(SpaceUser.builder()
                .space(space)
                .user(User.builder().id(targetApplicant.getUser().getId()).build())
                .role(UserRole.USER)
                .build());
      }


    } else {
      notificationService.createSpaceJoinResultNotificationInfo(space, user.getUsername(), targetApplicant.getUser().getId(), false);
      targetApplicant.setApprovalStatusCode(ApprovalStatusCode.REJECTED);
    }

    spaceRepository.save(space);

    return space;
  }

}
