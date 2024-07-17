package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseTemplateItemDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseTemplateItem;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcaseItem;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseItemDTO extends CommonDTO implements IDTO<TestrunTestcaseGroupTestcaseItem> {

    private Long id;
    private TestcaseTemplateItemDTO testcaseTemplateItem;
    private TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcase;
    private String type;
    private String value;
    private String text;

    public TestrunTestcaseGroupTestcaseItemDTO(TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem) {
        this.id = testrunTestcaseGroupTestcaseItem.getId();
        this.testcaseTemplateItem = new TestcaseTemplateItemDTO(testrunTestcaseGroupTestcaseItem.getTestcaseTemplateItem());
        this.testrunTestcaseGroupTestcase = TestrunTestcaseGroupTestcaseDTO.builder().id(testrunTestcaseGroupTestcaseItem.getTestrunTestcaseGroupTestcase().getId()).build();
        this.type = testrunTestcaseGroupTestcaseItem.getType();
        this.value = testrunTestcaseGroupTestcaseItem.getValue();
        this.text = testrunTestcaseGroupTestcaseItem.getText();
    }

    @Override
    public TestrunTestcaseGroupTestcaseItem toEntity() {
        TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = TestrunTestcaseGroupTestcaseItem.builder()
            .id(id)
            .testcaseTemplateItem(TestcaseTemplateItem.builder().id(testcaseTemplateItem.getId()).build())
            .type(type)
            .value(value)
            .text(text)
            .build();

        if (testrunTestcaseGroupTestcase != null) {
            testrunTestcaseGroupTestcaseItem.setTestrunTestcaseGroupTestcase(TestrunTestcaseGroupTestcase.builder().id(testrunTestcaseGroupTestcase.getId()).build());
        }

        return testrunTestcaseGroupTestcaseItem;
    }

    public TestrunTestcaseGroupTestcaseItem toEntity(TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase) {
        TestrunTestcaseGroupTestcaseItem testrunTestcaseGroupTestcaseItem = toEntity();
        testrunTestcaseGroupTestcaseItem.setTestrunTestcaseGroupTestcase(testrunTestcaseGroupTestcase);
        return testrunTestcaseGroupTestcaseItem;

    }
}
