package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseItemDTO;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Builder
@Table(name = "testcase_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestcaseItem extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_iemplate_item_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM__TESTCASE_TEMPLATE_ITEM"))
    private TestcaseTemplateItem testcaseTemplateItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_ITEM__TESTCASE"))
    private Testcase testcase;

    @Column(name = "type", length = ColumnsDef.CODE)
    private String type;

    @Column(name = "value", length = ColumnsDef.TEXT)
    private String value;

    @Column(columnDefinition = "text", name = "text")
    private String text;

    public void update(TestcaseItemDTO testcaseItem) {
        this.testcaseTemplateItem = TestcaseTemplateItem.builder().id(testcaseItem.getTestcaseTemplateItem().getId()).build();
        this.type = testcaseItem.getType();
        this.value = testcaseItem.getValue();
        this.text = testcaseItem.getText();
    }

}
