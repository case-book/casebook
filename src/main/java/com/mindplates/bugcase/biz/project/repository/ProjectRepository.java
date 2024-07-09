package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.Project;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    String PROJECT_LIST_PROJECTION = "SELECT new Project(p.id, p.name, p.description, p.activated, p.token, p.aiEnabled, p.testcaseGroupSeq, p.testcaseSeq, p.testcaseSeq, (SELECT COUNT(tr.id) FROM Testrun tr WHERE tr.project.id = p.id), (SELECT COUNT(tc.id) FROM Testcase tc WHERE tc.project.id = p.id)) FROM Project p ";

    @Query(value = PROJECT_LIST_PROJECTION + " WHERE p.space.id = :spaceId")
    List<Project> findAllBySpaceId(Long spaceId);

    @Query(value = PROJECT_LIST_PROJECTION + " INNER JOIN ProjectUser pu ON p.id = pu.project.id WHERE p.space.code = :spaceCode AND pu.user.id = :userId")
    List<Project> findAllBySpaceCodeAndUsersUserId(String spaceCode, Long userId);

    @Query(value = "SELECT p.id FROM Project p WHERE p.id = :id AND p.space.id = (SELECT s.id FROM Space s WHERE s.code = :spaceCode)")
    Optional<Long> findIdBySpaceCodeAndId(String spaceCode, Long id);

    Long countBySpaceCodeAndName(String spaceCode, String name);

    Optional<Project> findBySpaceCodeAndId(String spaceCode, Long id);

    @Query(value = "SELECT p.name FROM Project p WHERE p.id = :id AND p.space.code = :spaceCode")
    Optional<String> findNameBySpaceCodeAndId(String spaceCode, Long id);

    Long countBySpaceId(Long spaceId);

    @Query("SELECT p.aiEnabled FROM Project p WHERE p.id = :projectId")
    boolean findAiEnabledById(Long projectId);

    @Modifying
    @Query("UPDATE Project p SET p.aiEnabled = false WHERE p.aiEnabled IS NULL")
    void updateProjectAiEnable();


}

