package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "testcase_item_file")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestcaseItemFile extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne
  @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM_FILE__PROJECT"))
  private Project project;

  @ManyToOne
  @JoinColumn(name = "testcase_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM_FILE__TESTCASE"))
  private Testcase testcase;

  @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
  private String name;

  @Column(name = "type", nullable = false, length = ColumnsDef.CODE)
  private String type;

  @Column(name = "path", nullable = false, length = ColumnsDef.PATH)
  private String path;

  @Column(name = "size", nullable = false)
  private Long size;


}
