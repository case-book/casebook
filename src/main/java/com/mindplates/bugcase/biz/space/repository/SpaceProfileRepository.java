package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SpaceProfileRepository extends JpaRepository<SpaceProfile, Long> {

    Long deleteBySpaceId(long spaceId);

    Optional<SpaceProfile> findBySpaceCodeAndId(String spaceCode, Long id);
    List<SpaceProfile> findAllBySpaceCode(String spaceCode);

    Long countBySpaceIdAndName(Long spaceId, String name);

}

