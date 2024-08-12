package com.mindplates.bugcase.biz.links.repository;

import com.mindplates.bugcase.biz.links.entity.OpenLink;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpenLinkRepository extends JpaRepository<OpenLink, Long> {
    List<OpenLink> findByProjectId(Long projectId);

}

