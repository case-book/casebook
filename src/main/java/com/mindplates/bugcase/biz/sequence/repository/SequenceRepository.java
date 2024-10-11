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

    @Query(value = "SELECT new Sequence(s.id, s.name, s.project.id, s.description, (select count(sn.id) from SequenceNode sn where sn.sequence.id = s.id), (select count(*) from SequenceEdge se where se.sequence.id = s.id)) FROM Sequence s WHERE s.project.id = :projectId ORDER BY s.id DESC")
    List<Sequence> findByProjectId(long projectId);

    List<Sequence> findByProjectIdOrderByIdDesc(long projectId);

    Long countByProjectIdAndName(long projectId, String name);

    Long countByProjectIdAndNameAndIdIsNot(long projectId, String name, long id);

    @Modifying
    @Query("DELETE FROM Sequence s WHERE s.project.id = :projectId")
    void deleteByProjectId(@Param("projectId") Long projectId);
}
