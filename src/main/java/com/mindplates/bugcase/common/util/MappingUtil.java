package com.mindplates.bugcase.common.util;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MappingUtil {

    private final ModelMapper modelMapper;

    public <T> T convert(Object originObject, Class<T> targetType) {
        return modelMapper.map(originObject, targetType);
    }

    public <T> List<T> convert(List<?> originObjects, Class<T> targetType) {
        return originObjects
            .stream()
            .map(p -> convert(p, targetType))
            .collect(Collectors.toList());
    }
}
