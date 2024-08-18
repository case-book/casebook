package com.mindplates.bugcase.framework.converter;


import java.time.Instant;
import java.time.LocalDateTime;
import java.util.TimeZone;
import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;

@Component
public class LongToLocalDateTimeConverter
    implements Converter<Long, LocalDateTime> {

    @Override
    public LocalDateTime convert(Long time) {
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(time), TimeZone.getDefault().toZoneId());
    }
}
