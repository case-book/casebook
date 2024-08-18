package com.mindplates.bugcase.biz.links.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
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
