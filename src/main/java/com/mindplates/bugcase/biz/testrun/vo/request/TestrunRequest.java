package com.mindplates.bugcase.biz.testrun.vo.request;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.entity.Testcase;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseGroup;
import com.mindplates.bugcase.biz.testrun.entity.Testrun;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroup;
import com.mindplates.bugcase.biz.testrun.entity.TestrunTestcaseGroupTestcase;
import com.mindplates.bugcase.biz.testrun.entity.TestrunUser;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class TestrunRequest {

    private Long id;

    private String seqId;
    private String name;
    private String description;

    private Long projectId;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private boolean opened;
    private List<TestrunUserRequest> testrunUsers;
    private List<TestrunTestcaseGroupRequest> testcaseGroups;


    public Testrun buildEntity() {

        Testrun testrun = Testrun.builder()
                .id(id)
                .name(name)
                .description(description)
                .project(Project.builder().id(projectId).build())
                .startDateTime(startDateTime)
                .endDateTime(endDateTime)
                .opened(opened)
                .build();

        if (testrunUsers != null) {
            List<TestrunUser> users = testrunUsers.stream()
                    .map((testrunUserRequest) -> TestrunUser.builder()
                            .id(testrunUserRequest.getId())
                            .user(com.mindplates.bugcase.biz.user.entity.User.builder().id(testrunUserRequest.getUserId()).build())
                            .testrun(testrun)
                            .build())
                    .collect(Collectors.toList());

            testrun.setTestrunUsers(users);
        }

        if (testcaseGroups != null) {
            List<TestrunTestcaseGroup> groups = testcaseGroups.stream()
                    .map((testrunTestcaseGroupRequest) -> {
                        TestrunTestcaseGroup testrunTestcaseGroup = TestrunTestcaseGroup.builder()
                                .id(testrunTestcaseGroupRequest.getId())
                                .testrun(testrun)
                                .testcaseGroup(TestcaseGroup.builder().id(testrunTestcaseGroupRequest.getTestcaseGroupId()).build())
                                .testrun(testrun)
                                .build();

                        if (testrunTestcaseGroupRequest.getTestcases() != null) {
                            List<TestrunTestcaseGroupTestcase> testcases = testrunTestcaseGroupRequest.getTestcases().stream()
                                    .map((testrunTestcaseGroupTestcaseRequest) -> TestrunTestcaseGroupTestcase.builder()
                                            .id(testrunTestcaseGroupTestcaseRequest.getId())
                                            .testrunTestcaseGroup(testrunTestcaseGroup)
                                            .testcase(Testcase.builder().id(testrunTestcaseGroupTestcaseRequest.getTestcaseId()).build())
                                            .build())
                                    .collect(Collectors.toList());

                            testrunTestcaseGroup.setTestcases(testcases);
                        }

                        return testrunTestcaseGroup;
                    })
                    .collect(Collectors.toList());

            testrun.setTestcaseGroups(groups);
        }


        return testrun;
    }


}
