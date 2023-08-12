package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
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
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.util.CollectionUtils;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "testrun_testcase_group_testcase")
public class TestrunTestcaseGroupTestcase extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_testcase_group_id", foreignKey = @ForeignKey(name = "FK_TTGT__TESTRUN_TESTCASE_GROUP"))
    private TestrunTestcaseGroup testrunTestcaseGroup;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.DETACH)
    @JoinColumn(name = "testcase_id", foreignKey = @ForeignKey(name = "FK_TTGT__TESTCASE"))
    private Testcase testcase;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunTestcaseGroupTestcase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunTestcaseGroupTestcaseItem> testcaseItems;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testrunTestcaseGroupTestcase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestrunTestcaseGroupTestcaseComment> comments;

    @Column(name = "test_result", length = ColumnsDef.CODE)
    private TestResultCode testResult;

    @OneToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_TESTCASE_GROUP_TESTCASE__USER"))
    private User tester;


    public int assignTester(Project project, Testcase testcase, List<TestrunUser> testrunUsers, int currentSeq, Random random) {
        Map<String, List<ProjectUser>> tagUserMap = getTagUserMap(project.getUsers(), testrunUsers);
        List<TestcaseItem> items = testcase.getTestcaseItems();
        this.testResult = TestResultCode.UNTESTED;
        if (!testrunUsers.isEmpty()) {
            currentSeq = assignByType(tagUserMap, random, testrunUsers, currentSeq);
        }
        for (TestcaseItem testcaseItem : items) {
            if (testcaseItem.getValue() == null) {
                continue;
            }
            TestcaseTemplateItem testcaseTemplateItem = testcaseItem.getTestcaseTemplateItem();
            if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {
                TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem.builder()
                    .testcaseTemplateItem(testcaseTemplateItem)
                    .testrunTestcaseGroupTestcase(this)
                    .type("value")
                    .build();
                if (!testrunUsers.isEmpty()) {
                    if ("RND".equals(testcaseItem.getValue())) {
                        int userIndex = random.nextInt(testrunUsers.size());
                        testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(userIndex).getUser().getId().toString());
                    } else if ("SEQ".equals(testcaseItem.getValue())) {
                        if (currentSeq > testrunUsers.size() - 1) {
                            currentSeq = 0;
                        }
                        testrunTestcaseGroupTestcaseItem.setValue(testrunUsers.get(currentSeq).getUser().getId().toString());
                        currentSeq++;
                    } else {
                        testrunTestcaseGroupTestcaseItem.setValue(testcaseItem.getValue());
                    }
                }
                if (this.testcaseItems == null) {
                    this.testcaseItems = new ArrayList<>();
                }
                this.testcaseItems.add(testrunTestcaseGroupTestcaseItem);
            }
        }
        return currentSeq;
    }

    public int reAssignTester(Project project, List<TestrunUser> testrunUsers, int currentSeq, Random random) {
        Map<String, List<ProjectUser>> tagUserMap = getTagUserMap(project.getUsers(), testrunUsers);
        boolean removedUser = testrunUsers.stream()
            .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(this.tester != null ? this.tester.getId() : null));
        if (removedUser) {
            if (!testrunUsers.isEmpty()) {
                currentSeq = assignByType(tagUserMap, random, testrunUsers, currentSeq);
            } else {
                this.tester = null;
            }
        }
        return currentSeq;
    }

    private int assignByType(Map<String, List<ProjectUser>> tagUserMap, Random random, List<TestrunUser> testrunUsers, int currentSeq) {
        // 테스터 입력
        if ("tag".equals(testcase.getTesterType())) {
            if (tagUserMap.containsKey(testcase.getTesterValue())) {
                List<ProjectUser> tagUsers = tagUserMap.get(testcase.getTesterValue());
                int userIndex = random.nextInt(tagUsers.size());
                this.tester = User.builder().id(tagUsers.get(userIndex).getUser().getId()).build();
            } else {
                int userIndex = random.nextInt(testrunUsers.size());
                this.tester = User.builder().id(testrunUsers.get(userIndex).getUser().getId()).build();
            }
        } else if ("operation".equals(testcase.getTesterType())) {
            if ("RND".equals(testcase.getTesterValue())) {
                int userIndex = random.nextInt(testrunUsers.size());
                this.tester = User.builder().id(testrunUsers.get(userIndex).getUser().getId()).build();
            } else if ("SEQ".equals(testcase.getTesterValue())) {
                if (currentSeq > testrunUsers.size() - 1) {
                    currentSeq = 0;
                }
                this.tester = User.builder().id(testrunUsers.get(currentSeq).getUser().getId()).build();
                currentSeq++;
            }
        } else {
            this.tester = User.builder().id(Long.parseLong(testcase.getTesterValue())).build();
        }
        return currentSeq;
    }

    private Map<String, List<ProjectUser>> getTagUserMap(List<ProjectUser> projectUsers, List<TestrunUser> testrunUsers) {
        Map<String, List<ProjectUser>> tagUserMap = new HashMap<>();
        projectUsers.forEach((projectUserDTO -> {
            String tagString = projectUserDTO.getTags();
            if (tagString != null) {
                String[] tags = tagString.split(";");
                if (tags.length > 0) {
                    Arrays.stream(tags).forEach(tag -> {
                        if (tag.length() > 0) {
                            if (!tagUserMap.containsKey(tag)) {
                                tagUserMap.put(tag, new ArrayList<>());
                            }
                            List<ProjectUser> users = tagUserMap.get(tag);
                            if (testrunUsers.stream().anyMatch(
                                testrunUser -> testrunUser.getUser().getId()
                                    .equals(projectUserDTO.getUser().getId()))) {
                                users.add(projectUserDTO);
                            }
                        }
                    });
                }
            }
        }));
        tagUserMap.keySet().removeIf(key -> CollectionUtils.isEmpty(tagUserMap.get(key)));
        return tagUserMap;
    }

}
