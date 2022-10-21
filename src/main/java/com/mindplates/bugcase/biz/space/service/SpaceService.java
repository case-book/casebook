package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.biz.space.repository.SpaceRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceUserRepository;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.RoleCode;
import com.mindplates.bugcase.framework.config.CacheConfig;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class SpaceService {

    private final SpaceRepository spaceRepository;

    private final SpaceUserRepository spaceUserRepository;

    @Cacheable(key = "#id", value = CacheConfig.SPACE)
    public Optional<Space> selectSpaceInfo(Long id) {
        return spaceRepository.findById(id);
    }

    public boolean selectIsSpaceMember(String spaceCode, Long userId) {
        return spaceRepository.existsByCodeAndUsersUserId(spaceCode, userId);
    }

    public Optional<Space> selectSpaceInfo(String code) {
        return spaceRepository.findByCode(code);
    }

    @CacheEvict(key = "#id", value = CacheConfig.SPACE)
    @Transactional
    public void deleteSpaceInfo(Long id) {
        spaceRepository.deleteById(id);
    }

    @CacheEvict(key = "'supported'", value = CacheConfig.SPACE)
    @Transactional
    public Space createSpaceInfo(Space space, Long userId) {
        SpaceUser spaceUser = SpaceUser.builder().space(space).user(User.builder().id(userId).build()).role(RoleCode.ADMIN).build();
        space.setUsers(Arrays.asList(spaceUser));
        spaceRepository.save(space);
        return space;
    }


    @CacheEvict(key = "#space.id", value = CacheConfig.SPACE)
    @Transactional
    public Space updateSpaceInfo(Space space) {
        spaceRepository.save(space);
        return space;
    }


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

}
