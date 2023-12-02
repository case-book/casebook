package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
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

@Entity
@Builder
@Table(name = "project_release")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectRelease extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 128)
    private String name;

    @Column(name = "description", length = 512)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @OneToMany(mappedBy = "projectRelease", cascade = CascadeType.ALL)
    private List<TestcaseProjectRelease> testcaseProjectReleases;

    public ProjectRelease(ProjectReleaseDTO projectReleaseDTO, List<Testcase> testcases) {
        setName(projectReleaseDTO.getName());
        setDescription(projectReleaseDTO.getDescription());
        setProject(Project.builder().id(projectReleaseDTO.getProject().getId()).build());

        setTestcaseProjectReleases(testcases.stream()
            .map(testcase -> TestcaseProjectRelease.builder()
                .testcase(testcase)
                .projectRelease(this)
                .build())
            .collect(Collectors.toList()));
    }


}
