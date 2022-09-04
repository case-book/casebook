package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.biz.common.entity.CommonEntity;
import com.mindplates.bugcase.biz.common.entity.RoleCode;
import com.mindplates.bugcase.biz.user.entity.User;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "space_user")
public class SpaceUser extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private RoleCode role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_USER__SPACE"))
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE__USER"))
    private Space space;

}
