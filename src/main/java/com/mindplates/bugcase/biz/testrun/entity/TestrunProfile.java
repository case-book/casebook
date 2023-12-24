package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
import com.mindplates.bugcase.common.entity.CommonEntity;
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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "testrun_profile")
public class TestrunProfile extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_PROFILE__TESTRUN"))
    private Testrun testrun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_profile_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_PROFILE__SPACE_PROFILE"))
    private SpaceProfile profile;

    @Column(name = "item_order")
    private Integer itemOrder;

}
