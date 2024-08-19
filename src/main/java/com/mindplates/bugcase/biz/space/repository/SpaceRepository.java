package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.Space;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SpaceRepository extends JpaRepository<Space, Long> {

    String LIST_PROJECTION = "SELECT new Space(s.id, s.name, s.code, s.activated, s.allowSearch, s.allowAutoJoin, s.description, (SELECT COUNT(p.id) FROM Project p WHERE p.space.id = s.id), (SELECT COUNT(sp.id) FROM SpaceUser sp WHERE sp.space.id = s.id)) FROM Space s ";
    String USER_LIST_PROJECTION = "SELECT new Space(s.id, s.name, s.code, s.activated, s.allowSearch, s.allowAutoJoin, s.description, (SELECT COUNT(p.id) FROM Project p WHERE p.space.id = s.id), (SELECT COUNT(sp.id) FROM SpaceUser sp WHERE sp.space.id = s.id), EXISTS(SELECT sp.id FROM SpaceUser sp WHERE sp.space.id = s.id AND sp.user.id = :userId) , EXISTS(SELECT sp.id FROM SpaceUser sp WHERE sp.space.id = s.id AND sp.user.id = :userId AND sp.role = 'ADMIN')) FROM Space s ";


    @Query(LIST_PROJECTION)
    List<Space> findAll();

    @Query(value = "SELECT s.code FROM Space s WHERE s.id = :spaceId")
    Optional<String> findCodeById(Long spaceId);

    @Query(value = "SELECT s.code FROM Space s WHERE s.id = (SELECT p.space.id FROM Project p WHERE p.id = :projectId)")
    Optional<String> findCodeByProjectId(Long projectId);

    @Query(value = "SELECT s.name FROM Space s WHERE s.code = :spaceCode")
    Optional<String> findNameByCode(String spaceCode);

    @Query(USER_LIST_PROJECTION + "WHERE s.id IN (SELECT sp.space.id FROM SpaceUser sp WHERE sp.user.id = :userId)")
    List<Space> findAllByUsersUserId(Long userId);

    @Query(USER_LIST_PROJECTION + "WHERE s.id IN (SELECT sp.space.id FROM SpaceUser sp WHERE sp.user.id = :userId) AND LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Space> findAllByUsersUserIdAndNameContainingIgnoreCase(Long userId, String query);


    Optional<Space> findByCode(String code);

    @Query(USER_LIST_PROJECTION + "WHERE (s.name like :name OR s.code like :code) AND s.allowSearch = true")
    List<Space> findAllByNameLikeAndAllowSearchTrueOrCodeLikeAndAllowSearchTrue(String name, String code, Long userId);

    Long countByCode(String code);

    boolean existsByCode(String code);

    @Query("SELECT s.id FROM Space s WHERE s.code = :spaceCode")
    Optional<Long> findIdByCode(String spaceCode);

}

