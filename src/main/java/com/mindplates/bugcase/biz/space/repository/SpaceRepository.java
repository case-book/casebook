package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.Space;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    List<Space> findAllByUsersUserId(Long userId);

    List<Space> findAllByUsersUserIdAndNameContainingIgnoreCase(Long userId, String query);


    Optional<Space> findByCode(String code);

    List<Space> findAllByNameLikeAndAllowSearchTrueOrCodeLikeAndAllowSearchTrue(String name, String code);

    boolean existsByCodeAndUsersUserId(String spaceCode, Long userId);

}

