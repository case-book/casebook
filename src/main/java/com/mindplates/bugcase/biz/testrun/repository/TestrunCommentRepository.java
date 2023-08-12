package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunComment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunCommentRepository extends JpaRepository<TestrunComment, Long> {

    @Modifying
    @Query("DELETE FROM TestrunComment tc where tc.id = :testrunCommentId")
    void deleteById(@Param("testrunCommentId") Long testrunCommentId);

    @Modifying
    @Query("DELETE FROM TestrunComment tc WHERE tc.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    List<TestrunComment> findAllByTestrunProjectIdAndTestrunIdOrderByCreationDateAsc(Long projectId, Long testrunId);

    Optional<TestrunComment> findByTestrunProjectIdAndTestrunIdAndId(Long projectId, Long testrunId, Long commentId);


}

