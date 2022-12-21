package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;


@Entity
@Builder
@Table(name = "testcase_template")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestcaseTemplate extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
  private String name;

  @Column(name = "is_default")
  private Boolean isDefault;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM_TYPE__PROJECT"))
  private Project project;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "testcaseTemplate", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(value = FetchMode.SELECT)
  private List<TestcaseTemplateItem> testcaseTemplateItems;

  @Column(name = "default_tester_type", length = ColumnsDef.CODE)
  private String defaultTesterType;

  @Column(name = "default_tester_value", length = ColumnsDef.CODE)
  private String defaultTesterValue;

  @Transient
  private boolean deleted;

}
