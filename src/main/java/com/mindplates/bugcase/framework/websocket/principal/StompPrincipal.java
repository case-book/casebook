package com.mindplates.bugcase.framework.websocket.principal;

import java.security.Principal;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class StompPrincipal implements Principal {

    private final String name;

    @Override
    public String getName() {
        return name;
    }

}
