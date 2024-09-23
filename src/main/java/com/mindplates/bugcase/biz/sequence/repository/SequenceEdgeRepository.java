package com.mindplates.bugcase.biz.sequence.repository;

import com.mindplates.bugcase.biz.sequence.entity.SequenceEdge;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SequenceEdgeRepository extends JpaRepository<SequenceEdge, Long> {

    List<SequenceEdge> findBySequenceId(long sequenceId);

    @Modifying
    @Query("DELETE FROM SequenceEdge sd WHERE sd.sequence.id = :sequenceId")
    void deleteBySequenceId(@Param("sequenceId") Long sequenceId);
}
