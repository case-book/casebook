package com.mindplates.bugcase.biz.sequence.repository;

import com.mindplates.bugcase.biz.sequence.entity.Sequence;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SequenceRepository extends JpaRepository<Sequence, Long> {

    List<Sequence> findByProjectIdOrderByNameDesc(long projectId);

    Long countByProjectIdAndName(long projectId, String name);

    Long countByProjectIdAndNameAndIdIsNot(long projectId, String name, long id);

    @Modifying
    @Query("DELETE FROM Sequence s WHERE s.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
}
