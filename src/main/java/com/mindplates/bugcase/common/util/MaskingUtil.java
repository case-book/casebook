package com.mindplates.bugcase.common.util;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MaskingUtil {

    public static String masking(String input) {
        if (input == null || input.length() <= 8) {
            return input;
        }

        String prefix = input.substring(0, 4);
        String suffix = input.substring(input.length() - 4);

        return prefix
            + "*".repeat(input.length() - 8)
            + suffix;
    }
}
