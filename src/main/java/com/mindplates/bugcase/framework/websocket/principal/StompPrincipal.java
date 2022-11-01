package com.mindplates.bugcase.framework.websocket.principal;

import lombok.AllArgsConstructor;

import java.security.Principal;

@AllArgsConstructor
public class StompPrincipal implements Principal {

    private final String name;

    @Override
    public String getName() {
        return name;
    }

}
