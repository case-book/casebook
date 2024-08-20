package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectUser;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItem;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
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
public class TestrunTestcaseGroupTestcase extends CommonEntity implements Cloneable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER) //
    @Fetch(value = FetchMode.JOIN) //
    @JoinColumn(name = "testrun_testcase_group_id", foreignKey = @ForeignKey(name = "FK_TTGT__TESTRUN_TESTCASE_GROUP"))
    private TestrunTestcaseGroup testrunTestcaseGroup;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH) //
    @Fetch(value = FetchMode.JOIN) //
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

    public TestrunTestcaseGroupTestcase(long id, Long testerId, TestResultCode testResult) {
        this.id = id;
        if (testerId != null) {
            this.tester = User.builder().id(testerId).build();
        }
        this.testResult = testResult;
    }


    public int assignTester(Project project, TestcaseDTO testcase, List<TestrunUser> testrunUsers, int currentSeq, Random random, Boolean autoTestcaseNotAssignedTester) {
        Map<String, List<ProjectUser>> tagUserMap = project.getUsersByTag(testrunUsers);
        List<TestcaseItemDTO> items = testcase.getTestcaseItems();
        this.testResult = TestResultCode.UNTESTED;
        if (!testrunUsers.isEmpty()) {
            // 아이템 중에서 systemLabel이 AUTOMATION이 아이템 찾기
            TestcaseItemDTO automationItem =
                items != null ? items.stream().filter(item -> item.getTestcaseTemplateItem().getSystemLabel() != null && "AUTOMATION".equals(item.getTestcaseTemplateItem().getSystemLabel()))
                    .findFirst().orElse(null) : null;
            boolean isAutomationItem = automationItem != null && "Y".equals(automationItem.getValue());

            if (!(autoTestcaseNotAssignedTester != null && autoTestcaseNotAssignedTester && isAutomationItem)) {
                currentSeq = assignByType(tagUserMap, random, testrunUsers, testcase, currentSeq);
            }

        }
        if (!CollectionUtils.isEmpty(items)) {
            for (TestcaseItemDTO testcaseItem : items) {
                if (testcaseItem.getValue() == null) {
                    continue;
                }
                TestcaseTemplateItemDTO testcaseTemplateItem = testcaseItem.getTestcaseTemplateItem();
                if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {
                    TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem.builder()
                        .testcaseTemplateItem(testcaseTemplateItem.toEntity())
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
        }
        return currentSeq;
    }

    public int reAssignTester(Project project, TestcaseDTO testcase, List<TestrunUser> testrunUsers, int currentSeq, Random random) {
        Map<String, List<ProjectUser>> tagUserMap = project.getUsersByTag(testrunUsers);
        boolean removedUser = testrunUsers.stream()
            .noneMatch(testrunUser -> testrunUser.getUser().getId().equals(this.tester != null ? this.tester.getId() : null));
        if (removedUser) {
            if (!testrunUsers.isEmpty()) {
                currentSeq = assignByType(tagUserMap, random, testrunUsers, testcase, currentSeq);
            } else {
                this.tester = null;
            }
        }
        return currentSeq;
    }

    public int changeTester(Project project, TestcaseDTO testcase, List<TestrunUser> testrunUsers, int currentSeq, Random random) {
        Map<String, List<ProjectUser>> tagUserMap = project.getUsersByTag(testrunUsers);

        if (!testrunUsers.isEmpty()) {
            currentSeq = assignByType(tagUserMap, random, testrunUsers, testcase, currentSeq);
        }
        return currentSeq;
    }

    private int assignByType(Map<String, List<ProjectUser>> tagUserMap, Random random, List<TestrunUser> testrunUsers, TestcaseDTO testcase,
        int currentSeq) {
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

    public int addTestCaseItem(TestcaseTemplateItem testcaseTemplateItem, TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase,
        TestcaseItem testcaseItem, Random random, List<TestrunUser> testrunUsers, int currentSeq) {
        if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {

            TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem
                .builder().testcaseTemplateItem(testcaseTemplateItem)
                .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase)
                .type("value").build();
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
            if (testrunTestcaseGroupTestcase.getTestcaseItems() == null) {
                testrunTestcaseGroupTestcase.setTestcaseItems(new ArrayList<>());
            }
            testrunTestcaseGroupTestcase.getTestcaseItems().add(testrunTestcaseGroupTestcaseItem);
        }
        return currentSeq;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public TestrunTestcaseGroupTestcase cloneEntity() {
        try {
            TestrunTestcaseGroupTestcase copiedTestrunTestcaseGroupTestcase = (TestrunTestcaseGroupTestcase) this.clone();
            copiedTestrunTestcaseGroupTestcase.setId(null);
            return copiedTestrunTestcaseGroupTestcase;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported for Testrun", e);
        }
    }
}
