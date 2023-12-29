package com.mindplates.bugcase.biz.testrun.vo.response;

import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TestrunHookResponse {

    private Long id;
    private TestrunHookTiming timing;
    private String name;
    private String url;
    private String method;
    private List<Map<String, Object>> headers;
    private List<Map<String, Object>> bodies;
    private Long testrunId;
    private Long testrunReservationId;
    private Long testrunIterationId;
    private Integer retryCount;
    private String result;
    private String message;

    public TestrunHookResponse(TestrunHookDTO testrunHookDTO) {
        this.id = testrunHookDTO.getId();
        this.timing = testrunHookDTO.getTiming();
        this.name = testrunHookDTO.getName();
        this.url = testrunHookDTO.getUrl();
        this.method = testrunHookDTO.getMethod();
        this.headers = testrunHookDTO.getHeaders();
        this.bodies = testrunHookDTO.getBodies();
        if (testrunHookDTO.getTestrun() != null) {
            this.testrunId = testrunHookDTO.getTestrun().getId();
        }

        if (testrunHookDTO.getTestrunReservation() != null) {
            this.testrunReservationId = testrunHookDTO.getTestrunReservation().getId();
        }

        if (testrunHookDTO.getTestrunIteration() != null) {
            this.testrunIterationId = testrunHookDTO.getTestrunIteration().getId();
        }
        this.retryCount = testrunHookDTO.getRetryCount();
        this.result = testrunHookDTO.getResult();
        this.message = testrunHookDTO.getMessage();

    }


}
