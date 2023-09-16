package com.mindplates.bugcase.biz.project.entity;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplate;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestcaseGroup> testcaseGroups;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestcaseTemplate> testcaseTemplates;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectUser> users;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Column(updatable = false, insertable = false)
    private List<ProjectApplicant> applicants;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_PROJECT__SPACE"))
    private Space space;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @Column
    private List<ProjectRelease> projectReleases;

    @Column(name = "testcase_group_seq", columnDefinition = "integer default 0")
    private Integer testcaseGroupSeq = 0;

    @Column(name = "testcase_seq", columnDefinition = "integer default 0")
    private Integer testcaseSeq = 0;

    @Column(name = "testrun_seq", columnDefinition = "integer default 0")
    private Integer testrunSeq = 0;

    @Column(name = "slack_url", length = ColumnsDef.URL)
    private String slackUrl;

    @Column(name = "enable_testrun_alarm")
    private boolean enableTestrunAlarm;

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

    @JsonIgnore
    public boolean isSlackAlarmEnabled() {
        return this.enableTestrunAlarm && slackUrl != null && slackUrl.length() > 0;
    }

}
