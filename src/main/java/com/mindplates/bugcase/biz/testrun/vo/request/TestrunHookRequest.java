package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.testrun.dto.TestrunHookDTO;
import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.vo.IRequestVO;
import java.util.List;
import java.util.Map;
import javax.validation.constraints.NotEmpty;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class TestrunHookRequest implements IRequestVO<TestrunHookDTO> {

    private Long id;
    private TestrunHookTiming timing;
    @NotEmpty
    @Length(min = 1, max = 100)
    private String name;
    @NotEmpty
    @Length(min = 1, max = 200)
    private String url;
    @NotEmpty
    private String method;
    private List<Map<String, String>> headers;
    private List<Map<String, String>> bodies;
    private Integer retryCount;

    @Override
    public TestrunHookDTO toDTO() {
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
