package com.mindplates.bugcase.biz.testcase.entity;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TestcaseProjectReleaseId implements Serializable {

    private Long testcase;
    private Long projectRelease;

}
