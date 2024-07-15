package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.project.dto.ProjectReleaseDTO;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.project.entity.ProjectRelease;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
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

@Entity
@Builder
@Table(name = "testcase", indexes = {
    @Index(name = "IDX_TESTCASE_PROJECT_ID_AND_SEQ_ID", columnList = "project_id, seq_id", unique = true)
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Testcase extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seq_id", nullable = false, length = ColumnsDef.CODE)
    private String seqId;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @Column(name = "item_order")
    private Integer itemOrder;

    @Column(name = "closed")
    private Boolean closed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__PROJECT"))
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_group_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__TESTCASE_GROUP"))
    private TestcaseGroup testcaseGroup;

    @OneToOne
    @JoinColumn(name = "testcase_template_id", foreignKey = @ForeignKey(name = "FK_TESTCASE__TESTCASE_TEMPLATE"))
    private TestcaseTemplate testcaseTemplate;


    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testcase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestcaseItem> testcaseItems;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "testcase", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<TestcaseProjectRelease> testcaseProjectReleases;

    @Column(name = "tester_type", length = ColumnsDef.CODE)
    private String testerType;

    @Column(name = "tester_value", length = ColumnsDef.CODE)
    private String testerValue;

    @Column(name = "content_update_date")
    private LocalDateTime contentUpdateDate;

    public Testcase(long id, String seqId, String name) {
        this.id = id;
        this.seqId = seqId;
        this.name = name;
    }

    public int assignTester(TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase, List<TestrunUser> testrunUsers, Random random,
        int currentSeq) {
        if (this.testcaseItems != null) {
            for (TestcaseItem testcaseItem : this.testcaseItems) {
                if (testcaseItem.getValue() == null) {
                    continue;
                }
                TestcaseTemplateItem testcaseTemplateItem = testcaseItem.getTestcaseTemplateItem();
                if (TestcaseItemType.USER.equals(testcaseTemplateItem.getType())) {
                    TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = testrunTestcaseGroupTestcase
                        .getTestcaseItems()
                        .stream()
                        .filter(item -> item.getTestcaseTemplateItem().getId().equals(testcaseTemplateItem.getId()))
                        .findAny()
                        .orElse(null);
                    if (testrunTestcaseGroupTestcaseItem != null) {
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
                            }
                        } else {
                            testrunTestcaseGroupTestcaseItem.setValue(null);
                        }
                    }
                }
            }
        }

        return currentSeq;
    }


    public List<TestcaseProjectRelease> update(TestcaseDTO testcase) {
        this.name = testcase.getName();
        this.description = testcase.getDescription();
        this.itemOrder = testcase.getItemOrder();
        this.closed = testcase.getClosed();
        this.testcaseGroup = TestcaseGroup.builder().id(testcase.getTestcaseGroup().getId()).build();
        this.testcaseTemplate = TestcaseTemplate.builder().id(testcase.getTestcaseTemplate().getId()).build();
        this.testerType = testcase.getTesterType();
        this.testerValue = testcase.getTesterValue();
        this.contentUpdateDate = LocalDateTime.now();

        List<TestcaseProjectRelease> deletedTestcaseProjectReleaseList = this.testcaseProjectReleases.stream()
            .filter(testcaseProjectRelease -> testcase.getProjectReleases().stream().noneMatch(projectRelease -> projectRelease.getId().equals(testcaseProjectRelease.getProjectRelease().getId())))
            .collect(
                Collectors.toList());
        this.testcaseProjectReleases.removeIf(
            testcaseProjectRelease -> testcase.getProjectReleases().stream().noneMatch(projectRelease -> projectRelease.getId().equals(testcaseProjectRelease.getProjectRelease().getId())));

        for (ProjectReleaseDTO projectRelease : testcase.getProjectReleases()) {
            if (this.testcaseProjectReleases.stream().noneMatch(testcaseProjectRelease -> testcaseProjectRelease.getProjectRelease().getId().equals(projectRelease.getId()))) {
                this.testcaseProjectReleases.add(TestcaseProjectRelease.builder().projectRelease(ProjectRelease.builder().id(projectRelease.getId()).build()).testcase(this).build());
            }
        }

        // testcase.getTestcaseItems()의 id가 있는 경우, map으로 저장
        HashMap<Long, TestcaseItemDTO> testcaseItemById = new HashMap<Long, TestcaseItemDTO>();
        for (TestcaseItemDTO testcaseItem : testcase.getTestcaseItems()) {
            if (testcaseItem.getId() != null) {
                testcaseItemById.put(testcaseItem.getId(), testcaseItem);
            }
        }

        // 기존 testcaseItems를 순회하면서, testcaseItemById에 있는 경우 update, 없는 경우 remove
        for (TestcaseItem testcaseItem : this.testcaseItems) {
            TestcaseItemDTO testcaseItemDTO = testcaseItemById.get(testcaseItem.getId());
            if (testcaseItemDTO != null) {
                testcaseItem.update(testcaseItemDTO);
            } else {
                this.testcaseItems.remove(testcaseItem);
            }
        }

        // testcaseItemById에 있는 경우, 기존 testcaseItems에 없는 경우 add
        for (TestcaseItemDTO testcaseItem : testcase.getTestcaseItems()) {
            if (testcaseItem.getId() == null) {
                this.testcaseItems.add(testcaseItem.toEntity());
            }
        }

        return deletedTestcaseProjectReleaseList;


    }
}
