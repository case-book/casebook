package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestrunTestcaseGroupTestcaseUserTestResultDTO extends CommonDTO {

    private Long id;
    private TestResultCode testResult;
    private UserDTO tester;

    public TestrunTestcaseGroupTestcaseUserTestResultDTO(TestrunTestcaseGroupTestcase testrunTestcaseGroupTestcase) {
        this.id = testrunTestcaseGroupTestcase.getId();
        this.testResult = testrunTestcaseGroupTestcase.getTestResult();
        if (testrunTestcaseGroupTestcase.getTester() != null) {
            this.tester = UserDTO.builder().id(testrunTestcaseGroupTestcase.getTester().getId()).build();
        }
    }


}
