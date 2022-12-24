package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Builder
@Table(name = "testrun", indexes = {
    @Index(name = "IDX_TESTCASE_PROJECT_ID_AND_SEQ_ID", columnList = "project_id, seq_id", unique = true)
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Testrun extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "seq_id", nullable = false, length = ColumnsDef.CODE)
  private String seqId;

  @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
  private String name;

  @Column(name = "description", length = ColumnsDef.TEXT)
  private String description;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrun", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(value = FetchMode.SELECT)
  private List<TestrunUser> testrunUsers;

  @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrun", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(value = FetchMode.SELECT)
  private List<TestrunTestcaseGroup> testcaseGroups;

  @ManyToOne
  @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTRUN__PROJECT"))
  private Project project;

  @Column(name = "start_date_time")
  private LocalDateTime startDateTime;

  @Column(name = "end_date_time")
  private LocalDateTime endDateTime;

  @Column(name = "opened")
  private boolean opened;

  @Column(name = "total_testcase_count")
  private int totalTestcaseCount;

  @Column(name = "passed_testcase_count")
  private int passedTestcaseCount;

  @Column(name = "failed_testcase_count")
  private int failedTestcaseCount;

  @Column(name = "closed_date")
  private LocalDateTime closedDate;

}
