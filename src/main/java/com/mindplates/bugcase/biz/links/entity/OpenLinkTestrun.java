package com.mindplates.bugcase.biz.links.entity;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.common.entity.CommonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Table(name = "open_link_testrun")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OpenLinkTestrun extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "open_link_id", foreignKey = @ForeignKey(name = "FK_OPEN_LINK_TESTRUN__OPEN_LINK"))
    private OpenLink openLink;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_OPEN_LINK_TESTRUN__TESTRUN"))
    private Testrun testrun;


}
