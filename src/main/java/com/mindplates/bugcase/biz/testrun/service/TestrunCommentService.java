package com.mindplates.bugcase.biz.testrun.service;

import com.mindplates.bugcase.biz.testrun.dto.TestrunCommentDTO;
import com.mindplates.bugcase.biz.testrun.entity.TestrunComment;
import com.mindplates.bugcase.biz.testrun.repository.TestrunCommentRepository;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.service.UserCachedService;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.util.List;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestrunCommentService {

    private final TestrunCommentRepository testrunCommentRepository;
    private final UserCachedService userCachedService;


    @Transactional
    public TestrunCommentDTO createTestrunComment(long projectId, long testrunId, long userId, TestrunCommentDTO testrunCommentDTO) {
        TestrunComment testrunComment = testrunCommentDTO.toEntity(testrunId, userId);
        TestrunComment comment = testrunCommentRepository.save(testrunComment);
        UserDTO user = userCachedService.getUserInfo(userId);
        comment.setUser(user.toEntity());
        return new TestrunCommentDTO(comment);
    }

    public List<TestrunCommentDTO> selectTestrunCommentList(Long projectId, Long testrunId) {
        List<TestrunComment> testrunCommentList = testrunCommentRepository.findAllByTestrunProjectIdAndTestrunIdOrderByCreationDateAsc(projectId, testrunId);
        return testrunCommentList.stream().map(TestrunCommentDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public void deleteTestrunCommentInfo(Long projectId, Long testrunId, Long commentId, long userId) {
        TestrunComment testrunComment = testrunCommentRepository.findByTestrunProjectIdAndTestrunIdAndId(projectId, testrunId, commentId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        if (testrunComment.getUser().getId() != userId) {
            throw new ServiceException(HttpStatus.UNAUTHORIZED);
        }

        testrunCommentRepository.delete(testrunComment);
    }

    @Transactional
    public void deleteProjectComment(long projectId) {
        testrunCommentRepository.deleteByProjectId(projectId);
    }

    @Transactional
    public void deleteUserTestrunComment(long userId) {
        testrunCommentRepository.deleteByUserId(userId);
    }

    @Transactional
    public void deleteProjectTestrunUserComment(long projectId, long userId) {
        testrunCommentRepository.updateProjectTestrunCommentUserNullByUserId(projectId, userId);
    }

    @Transactional
    public void deleteProjectTestrunComment(long testrunId) {
        testrunCommentRepository.deleteByTestrunId(testrunId);
    }


}
