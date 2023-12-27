package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceVariable;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceVariableRepository extends JpaRepository<SpaceVariable, Long> {

    Long deleteBySpaceId(long spaceId);
    Optional<SpaceVariable> findBySpaceCodeAndId(String spaceCode, Long id);
    List<SpaceVariable> findAllBySpaceCode(String spaceCode);

    Long countBySpaceIdAndName(Long spaceId, String name);

}

