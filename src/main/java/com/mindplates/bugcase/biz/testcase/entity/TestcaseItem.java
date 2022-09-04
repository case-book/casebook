package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.common.constants.ColumnsDef;
import com.mindplates.bugcase.biz.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;


@Entity
@Builder
@Table(name = "testcase_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestcaseItem extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testcase_iemplate_item_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM__TESTCASE_TEMPLATE_ITEM"))
    private TestcaseTemplateItem testcaseTemplateItem;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testcase_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM__TESTCASE"))
    private Testcase testcase;

    @Column(name = "value", length = ColumnsDef.TEXT)
    private String value;

    @Column(columnDefinition = "text", name = "text")
    private String text;

}
