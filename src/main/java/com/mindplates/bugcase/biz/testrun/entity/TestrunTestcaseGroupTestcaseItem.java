package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
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
@Table(name = "testrun_testcase_group_testcase_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestrunTestcaseGroupTestcaseItem extends CommonEntity implements Cloneable {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_template_item_id", foreignKey = @ForeignKey(name = "FK_TTGTI__TESTCASE_TEMPLATE_ITEM"))
    private TestcaseTemplateItem testcaseTemplateItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_testcase_group_testcase_id", foreignKey = @ForeignKey(name = "FK_TTGTI__TESTRUN_TESTCASE_GROUP_TESTCASE"))
    private TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase;

    @Column(name = "type", length = ColumnsDef.CODE)
    private String type;

    @Column(name = "value", length = ColumnsDef.TEXT)
    private String value;

    @Column(columnDefinition = "text", name = "text")
    private String text;

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public TestrunTestcaseGroupTestcaseItem cloneEntity() {
        try {
            TestrunTestcaseGroupTestcaseItem copiedTestrunTestcaseGroupTestcaseItem = (TestrunTestcaseGroupTestcaseItem) this.clone();
            copiedTestrunTestcaseGroupTestcaseItem.setId(null);
            return copiedTestrunTestcaseGroupTestcaseItem;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported for Testrun", e);
        }
    }

}
