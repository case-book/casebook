package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceProfileVariable;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceProfileVariableRepository extends JpaRepository<SpaceProfileVariable, Long> {

    Long deleteBySpaceId(long spaceId);

    Long deleteBySpaceIdAndSpaceProfileId(long spaceId, long spaceProfileId);

    Long deleteBySpaceIdAndSpaceVariableId(long spaceId, long spaceVariableId);

    List<SpaceProfileVariable> findAllBySpaceCode(String spaceCode);

    Optional<SpaceProfileVariable> findBySpaceCodeAndId(String spaceCode, Long id);

    Optional<SpaceProfileVariable> findBySpaceCodeAndSpaceVariableIdAndSpaceProfileId(String spaceCode, Long spaceVariableId, Long spaceProfileId);

}

