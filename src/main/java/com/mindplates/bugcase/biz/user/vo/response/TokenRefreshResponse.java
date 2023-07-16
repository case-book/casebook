package com.mindplates.bugcase.biz.user.vo.response;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class TokenRefreshResponse {

    private final String token;
    private final String refreshToken;

}
