package com.mindplates.bugcase.framework.aware;


import com.mindplates.bugcase.common.constraints.Keys;
import com.mindplates.bugcase.common.vo.UserSession;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.AuditorAware;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpSession;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class LoginUserAuditorAware implements AuditorAware<Long> {

    private final HttpSession httpSession;

    @Override
    public Optional<Long> getCurrentAuditor() {

        UserSession userSession = (UserSession) httpSession.getAttribute(Keys.SESSION_KEY);
        if (userSession == null) {
            return null;
        }


        return Optional.ofNullable(userSession.getId());
    }
}
