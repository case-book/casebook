package com.mindplates.bugcase.biz.project.repository;

import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.common.code.UserRoleCode;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectUserRepository extends JpaRepository<ProjectUser, Long> {

    boolean existsByProjectIdAndUserId(Long projectId, Long userId);

    boolean existsByProjectIdAndUserIdAndRole(Long projectId, Long userId, UserRoleCode role);

    void deleteByUserId(Long userId);

    List<ProjectUser> findAllByProjectId(Long projectId);
}

