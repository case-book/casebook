package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import java.util.List;
import java.util.Map;
import javax.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class TestrunHookRequest {

    private Long id;
    @NotEmpty
    private TestrunHookTiming timing;
    @NotEmpty
    @Length(min = 1, max = 100)
    private String name;
    @NotEmpty
    @Length(min = 1, max = 200)
    private String url;
    @NotEmpty
    private String method;
    private List<Map<String, Object>> headers;
    private List<Map<String, Object>> bodies;
    private Integer retryCount;

    public TestrunHookDTO buildEntity() {
        return TestrunHookDTO.builder()
            .id(id)
            .timing(timing)
            .name(name)
            .url(url)
            .method(method)
            .headers(headers)
            .bodies(bodies)
            .retryCount(retryCount)
            .build();
    }


}
