package com.mindplates.bugcase.biz.testrun.repository;

import com.mindplates.bugcase.biz.testrun.entity.TestrunProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TestrunProfileRepository extends JpaRepository<TestrunProfile, Long> {


    @Modifying
    @Query("DELETE FROM TestrunProfile tp WHERE tp.testrun.id = :testrunId")
    void deleteByTestrunId(@Param("testrunId") Long testrunId);

    @Modifying
    @Query("DELETE FROM TestrunProfile tp WHERE tp.profile.id = :profileId")
    void deleteByProfileId(@Param("profileId") Long profileId);


}

