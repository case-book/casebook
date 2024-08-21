package com.mindplates.bugcase.framework.converter;

import static java.util.Collections.emptyList;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import org.apache.commons.lang3.StringUtils;

@Converter
public class LongListConverter implements AttributeConverter<List<Long>, String> {

    private static final String SPLIT_CHAR = ";";

    @Override
    public String convertToDatabaseColumn(List<Long> longList) {
        return longList != null ? String.join(SPLIT_CHAR, longList.stream().map((l) -> Long.toString(l)).collect(Collectors.toList())) : null;
    }

    @Override
    public List<Long> convertToEntityAttribute(String string) {
        return !StringUtils.isBlank(string) ? Arrays.asList(string.split(SPLIT_CHAR))
            .stream()
            .map(Long::parseLong).collect(Collectors.toList())
            : emptyList();
    }
}
