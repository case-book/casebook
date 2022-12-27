package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.TestResultCode;
import com.mindplates.bugcase.common.dto.CommonDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunTestcaseGroupTestcaseDTO extends CommonDTO {

    private Long id;
    private TestrunTestcaseGroupDTO testrunTestcaseGroup;
    private TestcaseDTO testcase;
    private List<TestrunTestcaseGroupTestcaseItemDTO> testcaseItems;
    private List<TestrunTestcaseGroupTestcaseCommentDTO> comments;
    private TestResultCode testResult;
    private UserDTO tester;


}
