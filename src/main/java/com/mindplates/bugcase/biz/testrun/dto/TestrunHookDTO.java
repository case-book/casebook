package com.mindplates.bugcase.biz.testrun.dto;

import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunHook;
import com.mindplates.bugcase.biz.testrun.entity.TestrunIteration;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.vo.IDTO;
import com.mindplates.bugcase.common.vo.TestrunHookResult;
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpMethod;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class TestrunHookDTO extends CommonDTO implements IDTO<TestrunHook> {


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
    }

    public TestrunHookResult request(HttpRequestUtil httpRequestUtil) {
        TestrunHookResult testrunHookResult = httpRequestUtil.request(this.url, HttpMethod.valueOf(this.method), this.headers, this.bodies);
        this.result = Integer.toString(testrunHookResult.getCode().value());
        return testrunHookResult;
    }

    @Override
    public TestrunHook toEntity() {
        TestrunHook testrunHook = TestrunHook.builder()
            .id(id)
            .timing(timing)
            .name(name)
            .url(url)
            .method(method)
            .headers(headers)
            .bodies(bodies)
            .retryCount(retryCount)
            .result(result)
            .build();

        if (testrun != null) {
            testrunHook.setTestrun(Testrun.builder().id(testrun.getId()).build());
        }

        if (testrunReservation != null) {
            testrunHook.setTestrunReservation(TestrunReservation.builder().id(testrunReservation.getId()).build());
        }

        if (testrunIteration != null) {
            testrunHook.setTestrunIteration(TestrunIteration.builder().id(testrunIteration.getId()).build());
        }

        return testrunHook;
    }

    public TestrunHook toEntity(Testrun testrun) {
        TestrunHook testrunHook = toEntity();
        testrunHook.setTestrun(testrun);
        return testrunHook;
    }

    public TestrunHook toEntity(TestrunReservation testrunReservation) {
        TestrunHook testrunHook = toEntity();
        testrunHook.setTestrunReservation(testrunReservation);
        return testrunHook;
    }

    public TestrunHook toEntity(TestrunIteration testrunIteration) {
        TestrunHook testrunHook = toEntity();
        testrunHook.setTestrunIteration(testrunIteration);
        return testrunHook;
    }
}
