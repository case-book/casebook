package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;


@Entity
@Builder
@Table(name = "testrun_testcase_group_testcase_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestrunTestcaseGroupTestcaseItem extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "testcase_template_item_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP_TESTCASE_ITEM__TESTCASE_TEMPLATE_ITEM"))
  private TestcaseTemplateItem testcaseTemplateItem;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "testrun_testcase_group_testcase_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP_TESTCASE_ITEM__TESTRUN_TESTCASE_GROUP_TESTCASE"))
  private TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase;

  @Column(name = "type", length = ColumnsDef.CODE)
  private String type;

  @Column(name = "value", length = ColumnsDef.TEXT)
  private String value;

  @Column(columnDefinition = "text", name = "text")
  private String text;

}
