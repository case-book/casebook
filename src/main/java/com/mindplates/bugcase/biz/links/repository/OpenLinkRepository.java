package com.mindplates.bugcase.biz.links.repository;

import com.mindplates.bugcase.biz.links.entity.OpenLink;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OpenLinkRepository extends JpaRepository<OpenLink, Long> {

    List<OpenLink> findByProjectId(long projectId);

    Optional<OpenLink> findByIdAndProjectId(long id, long projectId);

    Optional<OpenLink> findByToken(String token);

}

