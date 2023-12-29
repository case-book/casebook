package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.TestrunHook;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.vo.TestrunHookResult;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpMethod;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TestrunHookDTO extends CommonDTO {


    private Long id;
    private TestrunHookTiming timing;
    private String name;
    private String url;
    private String method;
    private List<Map<String, String>> headers;
    private List<Map<String, String>> bodies;
    private TestrunDTO testrun;
    private TestrunReservationDTO testrunReservation;
    private TestrunIterationDTO testrunIteration;
    private Integer retryCount;
    private String result;
    private String message;


    public TestrunHookDTO(TestrunHook testrunHook) {
        this.id = testrunHook.getId();
        this.timing = testrunHook.getTiming();
        this.name = testrunHook.getName();
        this.url = testrunHook.getUrl();
        this.method = testrunHook.getMethod();
        this.headers = testrunHook.getHeaders();
        this.bodies = testrunHook.getBodies();
        if (testrunHook.getTestrun() != null) {
            this.testrun = TestrunDTO.builder().id(testrunHook.getTestrun().getId()).build();
        }

        if (testrunHook.getTestrunReservation() != null) {
            this.testrunReservation = TestrunReservationDTO.builder().id(testrunHook.getTestrunReservation().getId()).build();
        }

        if (testrunHook.getTestrunIteration() != null) {
            this.testrunIteration = TestrunIterationDTO.builder().id(testrunHook.getTestrunIteration().getId()).build();
        }

        this.retryCount = testrunHook.getRetryCount();
        this.result = testrunHook.getResult();
        this.message = testrunHook.getMessage();
    }

    public TestrunHookResult request(HttpRequestUtil httpRequestUtil) {
        TestrunHookResult testrunHookResult = httpRequestUtil.request(this.url, HttpMethod.resolve(this.method), this.headers, this.bodies);
        this.result = Integer.toString(testrunHookResult.getCode().value());
        this.message = testrunHookResult.getMessage();

        return testrunHookResult;


    }
}
