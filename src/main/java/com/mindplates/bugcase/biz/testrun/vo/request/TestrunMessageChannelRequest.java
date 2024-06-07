package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunMessageChannelDTO;
import com.mindplates.bugcase.common.vo.IRequestVO;
import lombok.Data;

@Data
public class TestrunMessageChannelRequest implements IRequestVO<TestrunMessageChannelDTO> {

    private Long id;
    private Long projectMessageChannelId;

    @Override
    public TestrunMessageChannelDTO toDTO() {
        return TestrunMessageChannelDTO.builder()
            .id(id)
            .messageChannel(ProjectMessageChannelDTO.builder().id(projectMessageChannelId).build())
            .build();
    }

    public TestrunMessageChannelDTO toDTO(TestrunDTO testrun) {
        TestrunMessageChannelDTO dto = toDTO();
        dto.setTestrun(testrun);
        return dto;

    }


}
