package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseDTO;
import com.mindplates.bugcase.biz.testcase.service.TestcaseService;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunReservationDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunTestcaseGroupTestcaseItemDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunReservation;
import com.mindplates.bugcase.biz.testrun.repository.TestrunReservationRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunTestcaseGroupTestcaseRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunUserRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestrunReservationService {


    private final TestrunReservationRepository testrunReservationRepository;
    private final TestcaseService testcaseService;
    private final TestrunTestcaseGroupRepository testrunTestcaseGroupRepository;
    private final TestrunUserRepository testrunUserRepository;
    private final TestrunTestcaseGroupTestcaseRepository testrunTestcaseGroupTestcaseRepository;

    @Transactional
    public TestrunReservationDTO createTestrunReservationInfo(TestrunReservationDTO testrunReservation) {
        TestrunReservation result = testrunReservationRepository.save(testrunReservation.toEntity());
        result.updateTestcaseCount();
        return new TestrunReservationDTO(result, true);
    }

    public List<TestrunReservationDTO> selectProjectReserveTestrunList(String spaceCode, long projectId, Boolean expired) {
        List<TestrunReservation> list = testrunReservationRepository.findAllByProjectIdAndExpiredOrderByStartDateTimeDescIdDesc(projectId, expired);
        return list.stream().map(TestrunReservationDTO::new).collect(Collectors.toList());
    }


    public List<TestrunReservationDTO> selectReserveTestrunList() {
        List<TestrunReservation> list = testrunReservationRepository.findAllByExpiredFalse();
        return list.stream().map((testrun -> new TestrunReservationDTO(testrun, false))).collect(Collectors.toList());
    }


    public TestrunReservationDTO selectTestrunReservationInfo(long id) {
        TestrunReservation testrunReservation = testrunReservationRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new TestrunReservationDTO(testrunReservation, true);
    }


    public TestrunReservationDTO selectProjectTestrunReservationInfo(long testrunReservationId) {
        TestrunReservation testrunReservation = testrunReservationRepository.findById(testrunReservationId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        TestrunReservationDTO testrunReservationDTO = new TestrunReservationDTO(testrunReservation, true);
        LocalDateTime now = LocalDateTime.now();
        List<TestrunTestcaseGroupDTO> conditionalTestcaseGroupList = this.selectConditionalTestcaseGroups(testrunReservationDTO, now, null, new HashMap<>(), null);
        testrunReservationDTO.setConditionalTestcaseGroupList(conditionalTestcaseGroupList);

        return testrunReservationDTO;
    }

    public List<TestrunTestcaseGroupDTO> selectConditionalTestcaseGroups(TestrunReservationDTO testrunReservationDTO, LocalDateTime now, List<TestrunTestcaseGroupDTO> pTestcaseGroups, Map<Long, ArrayList<Long>> testcaseGroupIdMap, TestrunDTO testrun) {

        List<TestrunTestcaseGroupDTO> testcaseGroups = pTestcaseGroups == null ? new ArrayList<>() : pTestcaseGroups;

        List<TestcaseDTO> conditionalTestcaseList = new ArrayList<>();
        Map<Long, Boolean> conditionalTestcaseIdMap = new HashMap<>();
        if (testrunReservationDTO.getSelectCreatedTestcase() != null && testrunReservationDTO.getSelectCreatedTestcase()) {
            List<TestcaseDTO> createdTestcaseList = testcaseService
                .selectTestcaseItemListByCreationTime(testrunReservationDTO.getProject().getId(), testrunReservationDTO.getCreationDate(), now);
            for (TestcaseDTO testcaseDTO : createdTestcaseList) {
                conditionalTestcaseList.add(testcaseDTO);
                conditionalTestcaseIdMap.put(testcaseDTO.getId(), true);
            }
        }

        if (testrunReservationDTO.getSelectUpdatedTestcase() != null && testrunReservationDTO.getSelectUpdatedTestcase()) {
            List<TestcaseDTO> updateDateTestcaseList = testcaseService
                .selectTestcaseItemListByContentUpdateDate(testrunReservationDTO.getProject().getId(), testrunReservationDTO.getCreationDate(), now);

            for (TestcaseDTO testcaseDTO : updateDateTestcaseList) {
                if (!conditionalTestcaseIdMap.containsKey(testcaseDTO.getId())) {
                    conditionalTestcaseList.add(testcaseDTO);
                    conditionalTestcaseIdMap.put(testcaseDTO.getId(), true);
                }
            }
        }

        if (!CollectionUtils.isEmpty(conditionalTestcaseList)) {
            conditionalTestcaseList.forEach(testcaseDTO -> {
                Long testcaseGroupId = testcaseDTO.getTestcaseGroup().getId();
                Long testcaseId = testcaseDTO.getId();
                if (!testcaseGroupIdMap.containsKey(testcaseGroupId)) {
                    TestrunTestcaseGroupDTO testrunTestcaseGroupDTO = TestrunTestcaseGroupDTO.builder()
                        .testrun(testrun)
                        .testcaseGroup(testcaseDTO.getTestcaseGroup())
                        .testcases(new ArrayList<>())
                        .build();
                    testcaseGroups.add(testrunTestcaseGroupDTO);
                    testcaseGroupIdMap.put(testcaseGroupId, new ArrayList<>());
                }

                ArrayList<Long> testcaseIds = testcaseGroupIdMap.get(testcaseGroupId);
                if (!testcaseIds.contains(testcaseId)) {
                    TestrunTestcaseGroupDTO testcaseGroup = testcaseGroups.stream()
                        .filter(testrunTestcaseGroupDTO -> testrunTestcaseGroupDTO.getTestcaseGroup().getId().equals(testcaseGroupId))
                        .findFirst()
                        .orElse(null);
                    if (testcaseGroup != null) {
                        TestrunTestcaseGroupTestcaseDTO testrunTestcaseGroupTestcaseDTO = TestrunTestcaseGroupTestcaseDTO.builder()
                            .testrunTestcaseGroup(testcaseGroup)
                            .testcase(testcaseDTO)
                            .build();

                        testrunTestcaseGroupTestcaseDTO.setTestcaseItems(
                            testcaseDTO.getTestcaseItems()
                                .stream()
                                .map(testcaseItemDTO -> TestrunTestcaseGroupTestcaseItemDTO.builder()
                                    .testcaseTemplateItem(testcaseItemDTO.getTestcaseTemplateItem())
                                    .testrunTestcaseGroupTestcase(testrunTestcaseGroupTestcaseDTO)
                                    .type(testcaseItemDTO.getType())
                                    .value(testcaseItemDTO.getValue())
                                    .text(testcaseItemDTO.getText())
                                    .build()
                                ).collect(Collectors.toList()));
                        testcaseGroup.getTestcases().add(testrunTestcaseGroupTestcaseDTO);
                        testcaseIds.add(testcaseId);
                    }
                }
            });
        }

        return testcaseGroups;
    }


    @Transactional
    public void updateTestrunReserveExpired(Long testrunId, Boolean reserveExpired, Long referenceTestrunId) {
        testrunReservationRepository.updateTestrunReservationExpired(testrunId, reserveExpired, referenceTestrunId);
    }


    @Transactional
    public TestrunReservationDTO updateTestrunReservationInfo(String spaceCode, TestrunReservationDTO testrunReservation) {
        TestrunReservation newTestrunReservation = testrunReservation.toEntity();

        TestrunReservation targetTestrunReservation = testrunReservationRepository.findById(testrunReservation.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        targetTestrunReservation.updateInfo(newTestrunReservation);
        targetTestrunReservation.updateTestrunUsers(newTestrunReservation.getTestrunUsers());
        targetTestrunReservation.updateTestcaseGroups(newTestrunReservation.getTestcaseGroups());
        targetTestrunReservation.updateTestcaseAndGroupCount();

        TestrunReservation result = testrunReservationRepository.save(targetTestrunReservation);
        return new TestrunReservationDTO(result);
    }

    @Transactional
    public void deleteProjectTestrunReservationInfo(String spaceCode, long projectId, long testrunReservationId) {
        testrunTestcaseGroupTestcaseRepository.deleteByTestrunReservationId(testrunReservationId);
        testrunUserRepository.deleteByTestrunReservationId(testrunReservationId);
        testrunTestcaseGroupRepository.deleteByTestrunReservationId(testrunReservationId);
        testrunReservationRepository.deleteById(testrunReservationId);
    }


}
