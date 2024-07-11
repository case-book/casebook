package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface SpaceApplicantRepository extends JpaRepository<SpaceApplicant, Long> {

    @Modifying
    @Query("DELETE FROM SpaceApplicant sa WHERE sa.space.id = :spaceId AND sa.user.id = :userId")
    void deleteBySpaceIdAndUserId(Long spaceId, long userId);

    void deleteByUserId(Long userId);
}

