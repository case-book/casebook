package com.mindplates.bugcase.biz.testrun.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@RedisHash(value = "testrun_participant")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TestrunParticipant {

    @Id
    private String id;
    @Indexed
    private String spaceCode;
    @Indexed
    private Long projectId;
    @Indexed
    private Long testrunId;
    @Indexed
    private String sessionId;
    @Indexed
    private Long userId;
    private String userEmail;
    private String userName;
    private Long count;


}
