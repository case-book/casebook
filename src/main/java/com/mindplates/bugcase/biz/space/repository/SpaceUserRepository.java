package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.common.code.UserRole;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceUserRepository extends JpaRepository<SpaceUser, Long> {

  List<SpaceUser> findAllBySpaceCodeAndUserNameLikeOrSpaceCodeAndUserEmailLike(String spaceCode, String name, String spaceCode2, String email);

  List<SpaceUser> findAllBySpaceCode(String spaceCode);

  boolean existsBySpaceIdAndUserId(Long spaceId, Long userId);

  boolean existsBySpaceCodeAndUserId(String spaceCode, Long userId);

  boolean existsBySpaceIdAndUserIdAndRole(Long spaceId, Long userId, UserRole role);

  boolean existsBySpaceCodeAndUserIdAndRole(String spaceCode, Long userId, UserRole role);


}

