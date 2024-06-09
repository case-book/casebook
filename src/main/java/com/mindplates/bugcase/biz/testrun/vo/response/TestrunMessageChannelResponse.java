package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.project.dto.ProjectMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunMessageChannelDTO;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunMessageChannelResponse {

    private Long id;
    private Long projectMessageChannelId;


    public TestrunMessageChannelResponse(TestrunMessageChannelDTO testrunMessageChannel) {
        this.id = testrunMessageChannel.getId();
        this.projectMessageChannelId = testrunMessageChannel.getMessageChannel().getId();
    }
}
