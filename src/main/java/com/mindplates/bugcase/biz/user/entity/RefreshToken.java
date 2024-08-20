package com.mindplates.bugcase.biz.user.entity;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
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

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "value")
    private String value;

    @Column(name = "user_id")
    private long userId;

    @Column(name = "expiration_date")
    private LocalDateTime expirationDate;

}
