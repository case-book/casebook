package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;


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

  @Transient
  private boolean deleted;

}
