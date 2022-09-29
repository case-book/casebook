package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

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
    private List<Testcase> testcases;

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


}
