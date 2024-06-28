package com.mindplates.bugcase.biz.admin.util;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class PropertiesUtil {

    public static Map<String, String> getInfo(Properties memoryProperties) {
        Map<String, String> info = new HashMap<>();
        Enumeration<?> memoryEnums = memoryProperties.propertyNames();
        while (memoryEnums.hasMoreElements()) {
            String key = (String) memoryEnums.nextElement();
            String value = memoryProperties.getProperty(key);
            info.put(key, value);
        }

        return info;
    }

}
