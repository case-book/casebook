package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
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
@Table(name = "testcase_project_release")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@IdClass(TestcaseProjectReleaseId.class)
public class TestcaseProjectRelease extends CommonEntity {

    @Id
    @ManyToOne
    @JoinColumn(name = "testcase_id")
    private Testcase testcase;

    @Id
    @ManyToOne
    @JoinColumn(name = "project_release_id")
    private ProjectRelease projectRelease;


}
