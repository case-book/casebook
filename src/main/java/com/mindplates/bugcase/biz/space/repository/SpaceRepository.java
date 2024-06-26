package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.Space;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    @Query(value = "SELECT s.code FROM Space s WHERE s.id = :spaceId")
    Optional<String> findCodeById(Long spaceId);

    List<Space> findAllByUsersUserId(Long userId);

    List<Space> findAllByUsersUserIdAndNameContainingIgnoreCase(Long userId, String query);


    Optional<Space> findByCode(String code);

    List<Space> findAllByNameLikeAndAllowSearchTrueOrCodeLikeAndAllowSearchTrue(String name, String code);

    Long countByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT s.id FROM Space s WHERE s.code = :spaceCode")
    long findIdByCode(String spaceCode);

}

