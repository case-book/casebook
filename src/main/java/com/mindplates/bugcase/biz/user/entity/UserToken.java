package com.mindplates.bugcase.biz.user.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@Table(name = "user_token")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserToken extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_USER_TOKEN__USER"))
    private User user;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

    @Column(name = "token", nullable = false, length = ColumnsDef.TOKEN)
    private String token;

    @Column(name = "enabled")
    private boolean enabled;

    @Column(name = "last_access")
    private LocalDateTime lastAccess;

}
