package com.mindplates.bugcase.biz.testcase.vo.response;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseFileDTO;
import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseFileResponse {

    private Long id;
    private String name;
    private String type;
    private String path;
    private Long size;
    private String spaceCode;
    private Long projectId;

    private Long testcaseId;
    private String uuid;

    public TestcaseFileResponse(TestcaseFileDTO testcaseFile, String spaceCode, Long projectId, Long testcaseId) {
        this.id = testcaseFile.getId();
        this.name = testcaseFile.getName();
        this.type = testcaseFile.getType();
        this.path = testcaseFile.getPath();
        this.size = testcaseFile.getSize();
        this.spaceCode = spaceCode;
        this.projectId = projectId;
        this.testcaseId = testcaseId;
        this.uuid = testcaseFile.getUuid();

    }
}
