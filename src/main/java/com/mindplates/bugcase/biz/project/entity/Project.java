package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
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
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Builder
@Table(name = "project")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Project extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
  private String name;

  @Column(name = "description", length = ColumnsDef.TEXT)
  private String description;

  @Column(name = "activated")
  private boolean activated;

  @Column(name = "token", length = ColumnsDef.CODE)
  private String token;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(value = FetchMode.SELECT)
  private List<TestcaseGroup> testcaseGroups;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(value = FetchMode.SELECT)
  private List<TestcaseTemplate> testcaseTemplates;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(value = FetchMode.SELECT)
  private List<ProjectUser> users;

  @ManyToOne(fetch = FetchType.EAGER)
  @Fetch(value = FetchMode.SELECT)
  @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_PROJECT__SPACE"))
  private Space space;

  @Column(name = "testcase_group_seq", columnDefinition = "integer default 0")
  private Integer testcaseGroupSeq = 0;

  @Column(name = "testcase_seq", columnDefinition = "integer default 0")
  private Integer testcaseSeq = 0;

}
