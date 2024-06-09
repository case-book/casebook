package com.mindplates.bugcase.biz.space.repository;

import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SpaceMessageChannelRepository extends JpaRepository<SpaceMessageChannel, Long> {


    List<SpaceMessageChannel> findAllBySpaceCode(String spaceCode);

    List<SpaceMessageChannel> findAllBySpaceId(Long spaceId);


}

