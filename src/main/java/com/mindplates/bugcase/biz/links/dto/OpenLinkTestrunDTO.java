package com.mindplates.bugcase.biz.links.dto;

import com.mindplates.bugcase.biz.links.entity.OpenLink;
import com.mindplates.bugcase.biz.links.entity.OpenLinkTestrun;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
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
public class OpenLinkTestrunDTO extends CommonDTO implements IDTO<OpenLinkTestrun> {


    private Long id;
    private OpenLinkDTO openLink;
    private TestrunDTO testrun;

    public OpenLinkTestrunDTO(OpenLinkTestrun openLinkTestrun, boolean detail) {
        this.id = openLinkTestrun.getId();
        this.openLink = OpenLinkDTO.builder().id(openLinkTestrun.getOpenLink().getId()).build();
        this.testrun = new TestrunDTO(openLinkTestrun.getTestrun(), detail);
    }


    @Override
    public OpenLinkTestrun toEntity() {
        return OpenLinkTestrun.builder()
            .id(id)
            .openLink(OpenLink.builder().id(openLink.getId()).build())
            .testrun(Testrun.builder().id(testrun.getId()).build())
            .build();
    }

    public OpenLinkTestrun toEntity(OpenLink openLink) {
        OpenLinkTestrun openLinkTestrun = OpenLinkTestrun.builder()
            .id(id)
            .testrun(Testrun.builder().id(testrun.getId()).build())
            .build();

        openLinkTestrun.setOpenLink(openLink);

        return openLinkTestrun;
    }
}
