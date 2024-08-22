package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseProjectRelease;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

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

    @Column(name = "is_target")
    private Boolean isTarget;

    @Column(name = "description", length = 512)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_PROJECT_RELEASE__PROJECT"))
    private Project project;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "projectRelease", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestcaseProjectRelease> testcaseProjectReleases;

    public ProjectRelease(ProjectReleaseDTO projectReleaseDTO, List<Testcase> testcases) {
        setName(projectReleaseDTO.getName());
        setDescription(projectReleaseDTO.getDescription());
        setIsTarget(projectReleaseDTO.getIsTarget());
        setProject(Project.builder().id(projectReleaseDTO.getProject().getId()).build());

        setTestcaseProjectReleases(testcases.stream()
            .map(testcase -> TestcaseProjectRelease.builder()
                .testcase(testcase)
                .projectRelease(this)
                .build())
            .collect(Collectors.toList()));
    }


}
