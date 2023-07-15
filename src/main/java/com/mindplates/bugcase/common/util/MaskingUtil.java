package com.mindplates.bugcase.common.util;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;

@RequiredArgsConstructor(access = AccessLevel.PRIVATE)
public class MaskingUtil {

    public static String maskValue(String target, String replaceValue, int startIdx, int endIdx) {
        if (startIdx >= endIdx) {
            return target;
        }
        if (StringUtils.isEmpty(target) || target.length() < startIdx || target.length() < endIdx) {
            return target;
        }
        StringBuilder sb = new StringBuilder(target);
        sb.replace(startIdx, endIdx, replaceValue);
        return sb.toString();
    }

}
