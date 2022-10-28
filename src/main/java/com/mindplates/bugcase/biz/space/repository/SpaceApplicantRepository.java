package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceApplicantRepository extends JpaRepository<SpaceApplicant, Long> {

  Optional<SpaceApplicant> findBySpaceCodeAndUserId(String spaceCode, Long userId);

  List<SpaceApplicant> findAllBySpaceCode(String spaceCode);


}

