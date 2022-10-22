package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

  Optional<Project> findBySpaceCodeAndName(String spaceCode, String name);

  Optional<Project> findBySpaceCodeAndId(String spaceCode, Long id);

  List<Project> findAllBySpaceCode(String spaceCode);

  List<Project> findAllBySpaceId(Long spaceId);

  Long countBySpaceId(Long spaceId);


}

