package com.mindplates.bugcase.biz.testrun.mapper;

import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import org.modelmapper.PropertyMap;


public class TestrunListMapper extends PropertyMap<Testrun, TestrunDTO> {

    @Override
    protected void configure() {
        map().setId(source.getId());
        map().setSeqId(source.getSeqId());
        map().setName(source.getName());
        map().setDescription(source.getDescription());
        map().setStartDateTime(source.getStartDateTime());
        map().setEndDateTime(source.getEndDateTime());
        map().setOpened(source.isOpened());
        map().setTotalTestcaseCount(source.getTotalTestcaseCount());
        map().setPassedTestcaseCount(source.getPassedTestcaseCount());
        map().setFailedTestcaseCount(source.getFailedTestcaseCount());
        map().setClosedDate(source.getClosedDate());
    }
}
