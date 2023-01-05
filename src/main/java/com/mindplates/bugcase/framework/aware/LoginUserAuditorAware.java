package com.mindplates.bugcase.framework.aware;


import com.mindplates.bugcase.common.util.SessionUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import java.util.Optional;

@RequiredArgsConstructor
@Component
public class LoginUserAuditorAware implements AuditorAware<Long> {


    @Override
    public Optional<Long> getCurrentAuditor() {

        return Optional.ofNullable(SessionUtil.getUserId());
    }
}
