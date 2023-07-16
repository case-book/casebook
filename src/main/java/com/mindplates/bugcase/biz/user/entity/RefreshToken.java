package com.mindplates.bugcase.biz.user.entity;

import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "refresh_token", indexes = {
    @Index(name = "IDX_REFRESH_TOKEN_USER_ID", columnList = "user_id"),
    @Index(name = "IDX_REFRESH_TOKEN_USER_ID_VALUE", columnList = "user_id, value")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshToken {

    @Column
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column
    private String value;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

}
