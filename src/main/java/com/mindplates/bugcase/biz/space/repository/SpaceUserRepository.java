package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpaceUserRepository extends JpaRepository<SpaceUser, Long> {

    List<SpaceUser> findAllBySpaceCodeAndUserNameLikeOrSpaceCodeAndUserEmailLike(String spaceCode, String name, String spaceCode2, String email);

    List<SpaceUser> findAllBySpaceCode(String spaceCode);


}

