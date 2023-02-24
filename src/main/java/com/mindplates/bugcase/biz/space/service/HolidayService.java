package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.entity.Holiday;
import com.mindplates.bugcase.biz.space.repository.HolidayRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Slf4j
public class HolidayService {

    private final HolidayRepository holidayRepository;

    @Transactional
    public Holiday createHoliday(Holiday holiday) {
        holidayRepository.save(holiday);
        return holiday;
    }

    @Transactional
    public Holiday updateHoliday(Holiday holiday) {
        holidayRepository.save(holiday);
        return holiday;
    }

    @Transactional
    public void deleteHoliday(Holiday holiday) {
        holidayRepository.delete(holiday);
    }

    public List<Holiday> selectHolidayList() {
        return holidayRepository.findAll();
    }

    public Optional<Holiday> selectHolidayInfo(Long holidayId) {
        return holidayRepository.findById(holidayId);
    }


}
