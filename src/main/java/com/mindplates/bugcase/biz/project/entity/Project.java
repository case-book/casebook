package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import jakarta.persistence.Transient;
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
    private Long id;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @Column(name = "activated")
    private boolean activated;

    @Column(name = "token", length = ColumnsDef.CODE)
    private String token;

    @Column(name = "ai_enabled")
    private boolean aiEnabled;

    @Column(name = "testcase_group_seq", columnDefinition = "integer default 0")
    private Integer testcaseGroupSeq = 0;

    @Column(name = "testcase_seq", columnDefinition = "integer default 0")
    private Integer testcaseSeq = 0;

    @Column(name = "testrun_seq", columnDefinition = "integer default 0")
    private Integer testrunSeq = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_PROJECT__SPACE"))
    private Space space;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<TestcaseTemplate> testcaseTemplates;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<ProjectUser> users;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<ProjectMessageChannel> messageChannels;

    @Transient
    private Long testrunCount = 0L;

    @Transient
    private Long testcaseCount = 0L;

    public Project(LocalDateTime creationDate, long id, String name, String description, boolean activated, String token, boolean aiEnabled, int testcaseGroupSeq, int testcaseSeq, int testrunSeq, long testrunCount,
        long testcaseCount) {

        this.setCreationDate(creationDate);
        this.id = id;
        this.name = name;
        this.description = description;
        this.activated = activated;
        this.token = token;
        this.aiEnabled = aiEnabled;
        this.testcaseGroupSeq = testcaseGroupSeq;
        this.testcaseSeq = testcaseSeq;
        this.testrunSeq = testrunSeq;
        this.testrunCount = testrunCount;
        this.testcaseCount = testcaseCount;
    }

    public Map<String, List<ProjectUser>> getUsersByTag(List<TestrunUser> testrunUsers) {
        Map<String, List<ProjectUser>> result = new HashMap<>();
        this.users.forEach(projectUser -> {
            String tagString = projectUser.getTags();
            if (tagString != null) {
                String[] tags = tagString.split(";");
                if (tags.length > 0) {
                    Arrays.stream(tags).forEach(tag -> {
                        if (tag.length() > 0) {
                            if (!result.containsKey(tag)) {
                                result.put(tag, new ArrayList<>());
                            }
                            List<ProjectUser> projectUsers = result.get(tag);
                            if (testrunUsers.stream()
                                .anyMatch(testrunUserDTO -> testrunUserDTO.getUser().getId().equals(projectUser.getUser().getId()))) {
                                projectUsers.add(projectUser);
                            }
                        }
                    });
                }
            }
        });
        result.keySet().removeIf(key -> result.get(key).isEmpty());
        return result;
    }


}
