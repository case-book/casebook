package com.mindplates.bugcase.framework.converter;

import org.apache.commons.lang3.StringUtils;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Arrays;
import java.util.List;

import static java.util.Collections.emptyList;

@Converter
public class StringListConverter implements AttributeConverter<List<String>, String> {

    private static final String SPLIT_CHAR = ";";

    @Override
    public String convertToDatabaseColumn(List<String> stringList) {
        return stringList != null ? String.join(SPLIT_CHAR, stringList) : null;
    }

    @Override
    public List<String> convertToEntityAttribute(String string) {
        return !StringUtils.isBlank(string) ? Arrays.asList(string.split(SPLIT_CHAR)) : emptyList();
    }
}
