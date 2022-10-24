package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceUserRepository;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.UserRole;
import com.mindplates.bugcase.common.exception.ServiceException;
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

  public Optional<Space> selectSpaceInfo(Long id) {
    return spaceRepository.findById(id);
  }


  @Cacheable(key = "#code", value = CacheConfig.SPACE)
  public Optional<Space> selectSpaceInfo(String code) {
    return spaceRepository.findByCode(code);
  }


  @Caching(evict = {
      @CacheEvict(key = "#space.code", value = CacheConfig.SPACE),
      @CacheEvict(key = "'all-space-list'", value = CacheConfig.SPACE)
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
      @CacheEvict(key = "'all-space-list'", value = CacheConfig.SPACE)
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
      @CacheEvict(key = "'all-space-list'", value = CacheConfig.SPACE)
  })
  @Transactional
  public Space updateSpaceInfo(Space next) {
    Space space = this.selectSpaceInfo(next.getId()).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    space.merge(next);
    spaceRepository.save(space);
    return space;
  }


  @Cacheable(key = "'all-space-list'", value = CacheConfig.SPACE)
  public List<Space> selectSpaceList() {
    return spaceRepository.findAll();
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

}
