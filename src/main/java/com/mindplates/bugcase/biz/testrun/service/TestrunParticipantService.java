package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.testrun.dto.TestrunParticipantDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunParticipant;
import com.mindplates.bugcase.biz.testrun.repository.TestrunParticipantRedisRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestrunParticipantService {

    private final TestrunParticipantRedisRepository testrunParticipantRedisRepository;

    private String getParticipantId(String spaceCode, Long projectId, Long testrunId, Long userId, String sessionId) {
        return spaceCode + "-" + projectId + "-" + testrunId + "-" + userId + "-" + sessionId;
    }

    @Transactional
    public TestrunParticipantDTO createTestrunParticipantInfo(String spaceCode, Long projectId, Long testrunId, UserDTO user, String sessionId) {
        TestrunParticipant participant = TestrunParticipant.builder()
            .id(getParticipantId(spaceCode, projectId, testrunId, user.getId(), sessionId))
            .spaceCode(spaceCode)
            .projectId(projectId)
            .testrunId(testrunId)
            .sessionId(sessionId)
            .userId(user.getId())
            .userName(user.getName())
            .userEmail(user.getEmail())
            .build();

        return new TestrunParticipantDTO(testrunParticipantRedisRepository.save(participant));
    }

    @Transactional
    public void deleteTestrunParticipantInfo(TestrunParticipantDTO testrunParticipantDTO) {
        testrunParticipantRedisRepository.findById(testrunParticipantDTO.getId()).ifPresent(testrunParticipantRedisRepository::delete);
    }

    public List<TestrunParticipantDTO> selectTestrunParticipantList(String spaceCode, Long projectId, Long testrunId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository.findAllBySpaceCodeAndProjectIdAndTestrunId(spaceCode, projectId, testrunId);
        return testrunParticipants.stream().map(TestrunParticipantDTO::new).collect(Collectors.toList());
    }

    public TestrunParticipantDTO selectTestrunParticipantInfo(String spaceCode, Long projectId, Long testrunId, Long userId, String sessionId) {
        Optional<TestrunParticipant> testrunParticipant = testrunParticipantRedisRepository.findById(getParticipantId(spaceCode, projectId, testrunId, userId, sessionId));
        return testrunParticipant.map(TestrunParticipantDTO::new).orElse(null);

    }

    public boolean isExistParticipant(Long testrunId, Long userId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository.findAllByTestrunIdAndUserId(testrunId, userId);
        return !testrunParticipants.isEmpty();
    }

    public List<TestrunParticipantDTO> selectTestrunParticipantList(Long userId, String sessionId) {
        List<TestrunParticipant> testrunParticipants = testrunParticipantRedisRepository.findAllByUserIdAndSessionId(userId, sessionId);
        return testrunParticipants.stream().map(TestrunParticipantDTO::new).collect(Collectors.toList());
    }


}
