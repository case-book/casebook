package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    List<Space> findAllByUsersUserId(Long userId);

}

