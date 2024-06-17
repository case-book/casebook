package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long> {


    Long countBySpaceCodeAndName(String spaceCode, String name);

    Optional<Project> findBySpaceCodeAndId(String spaceCode, Long id);

    Optional<Project> findNameBySpaceCodeAndId(String spaceCode, Long id);

    List<Project> findAllBySpaceCode(String spaceCode);

    List<Project> findAllBySpaceId(Long spaceId);

    Long countBySpaceId(Long spaceId);

    List<Project> findAllBySpaceCodeAndUsersUserId(String spaceCode, Long userId);

    @Modifying
    @Query("UPDATE Project p SET p.aiEnabled = false WHERE p.aiEnabled IS NULL")
    void updateProjectAiEnable();


}

