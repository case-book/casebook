package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import com.mindplates.bugcase.common.code.UserRoleCode;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpaceUserRepository extends JpaRepository<SpaceUser, Long> {

    @Query("SELECT su FROM SpaceUser su JOIN FETCH su.user WHERE su.space.code = :spaceCode AND (su.user.name LIKE %:query% OR su.user.email LIKE %:query%)")
    List<SpaceUser> findAllBySpaceCodeAndUserNameLikeOrSpaceCodeAndUserEmailLike(String spaceCode, String query);

    @Query("SELECT su FROM SpaceUser su JOIN FETCH su.user WHERE su.space.code = :spaceCode")
    List<SpaceUser> findAllBySpaceCode(String spaceCode);

    boolean existsBySpaceIdAndUserId(Long spaceId, Long userId);

    boolean existsBySpaceCodeAndUserId(String spaceCode, Long userId);

    boolean existsBySpaceIdAndUserIdAndRole(Long spaceId, Long userId, UserRoleCode role);

    boolean existsBySpaceCodeAndUserIdAndRole(String spaceCode, Long userId, UserRoleCode role);

    void deleteByUserId(Long userId);
}

