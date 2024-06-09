package com.mindplates.bugcase.common.service;


import com.mindplates.bugcase.biz.project.dto.ProjectUserDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceMessageChannelDTO;
import com.mindplates.bugcase.biz.testrun.dto.TestrunDTO;
import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.vo.SlackMessage;
import com.mindplates.bugcase.common.vo.TestrunHookResult;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.support.MessageSourceAccessor;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MessageChannelService {

    private final HttpRequestUtil httpRequestUtil;

    private final MessageSourceAccessor messageSourceAccessor;

    @Value("${bug-case.web-url}")
    private String webUrl;


    public boolean sendTextToWebhookJson(HttpMethod httpMethod, String url, List<Map<String, String>> headers, String message) {
        try {
            TestrunHookResult result = httpRequestUtil.request(url, httpMethod, headers, message);
            return result.getCode().equals(HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return false;
        }
    }

    public boolean sendTextToWebhookFormData(HttpMethod httpMethod, String url, List<Map<String, String>> headers, List<Map<String, String>> payloads) {
        try {
            TestrunHookResult result = httpRequestUtil.request(url, httpMethod, headers, payloads);
            return result.getCode().equals(HttpStatus.OK);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return false;
        }
    }

    private boolean sendWebhook(SpaceMessageChannelDTO messageChannel, String message) {
        List<Map<String, String>> headers = messageChannel.getHeaderList();
        if (messageChannel.getPayloadType().equals(PayloadTypeCode.JSON)) {
            String jsonMessage = messageChannel.getJsonMessage(message);
            return sendTextToWebhookJson(messageChannel.getHttpMethod(), messageChannel.getUrl(), headers, jsonMessage);
        } else {
            List<Map<String, String>> payloads = messageChannel.getPayloadMessage(message);
            return sendTextToWebhookFormData(messageChannel.getHttpMethod(), messageChannel.getUrl(), headers, payloads);
        }
    }

    public boolean sendSlack(String url, String message) {
        try {
            httpRequestUtil.sendPost(url, SlackMessage.builder().username("CASEBOOK").icon_url(webUrl + "/logo192.png").text(message).build(),
                String.class);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return false;
        }

        return true;
    }


    /**
     * 테스트 실행이 시작될 때 메시지를 보냅니다.
     *
     * @param messageChannel 메시지가 전송될 채널입니다. 이것은 슬랙 채널이거나 웹훅일 수 있습니다.
     * @param spaceCode      프로젝트가 위치한 공간의 코드입니다.
     * @param projectId      테스트 실행이 시작되는 프로젝트의 ID입니다.
     * @param testrunId      시작되는 테스트 실행의 ID입니다.
     * @param testrunName    시작되는 테스트 실행의 이름입니다.
     * @param testers        테스트 실행에 할당된 테스터의 목록입니다.
     */
    public void sendTestrunStartMessage(SpaceMessageChannelDTO messageChannel, String spaceCode, Long projectId, Long testrunId, String testrunName,
        List<ProjectUserDTO> testers) {
        // 메시지를 구축하기 위해 새 StringBuilder를 생성합니다.
        StringBuilder message = new StringBuilder();

        // 테스트 실행을 위한 URL을 구성합니다.
        String testrunUrl = webUrl + "/spaces/" + spaceCode + "/projects/" + projectId + "/testruns/" + testrunId;

        // 테스트 실행이 생성되었다는 메시지를 추가합니다.
        message.append(messageSourceAccessor.getMessage("testrun.created", new Object[]{testrunName}));
        message.append('\n');

        // 테스트 실행을 위한 URL을 추가합니다.
        message.append(testrunUrl);
        message.append("\n\n");

        // 테스트 실행에 테스터가 할당되어 있다면, 그들의 정보를 메시지에 추가합니다.
        if (testers != null && !testers.isEmpty()) {
            for (ProjectUserDTO projectUserDTO : testers) {
                message
                    .append(messageSourceAccessor.getMessage("testrun.user.link", new Object[]{projectUserDTO.getUser().getName()}))
                    .append('\n')
                    .append(testrunUrl).append("?tester=").append(projectUserDTO.getUser().getId())
                    .append("\n\n");
            }
        }

        // 메시지 채널이 슬랙 채널이라면, 슬랙을 통해 메시지를 보냅니다.
        if (messageChannel.getMessageChannelType().equals(MessageChannelTypeCode.SLACK)) {
            sendSlack(messageChannel.getUrl(), message.toString());
        } else {
            // 그렇지 않다면, 웹훅을 통해 메시지를 보냅니다.
            sendWebhook(messageChannel, message.toString());
        }
    }


    /**
     * 테스트 실행이 재개될 때 메시지를 보냅니다.
     *
     * @param messageChannel 메시지가 전송될 채널입니다. 이것은 슬랙 채널이거나 웹훅일 수 있습니다.
     * @param spaceCode      프로젝트가 위치한 공간의 코드입니다.
     * @param projectId      테스트 실행이 재개되는 프로젝트의 ID입니다.
     * @param testrunId      재개되는 테스트 실행의 ID입니다.
     * @param testrunName    재개되는 테스트 실행의 이름입니다.
     * @param testers        테스트 실행에 할당된 테스터의 목록입니다.
     */
    public void sendTestrunReOpenMessage(SpaceMessageChannelDTO messageChannel, String spaceCode, Long projectId, Long testrunId, String testrunName,
        List<ProjectUserDTO> testers) {
        StringBuilder message = new StringBuilder();
        String testrunUrl = webUrl + "/spaces/" + spaceCode + "/projects/" + projectId + "/testruns/" + testrunId;
        message.append(messageSourceAccessor.getMessage("testrun.reopened", new Object[]{testrunName}))
            .append('\n')
            .append(testrunUrl)
            .append("\n\n");

        if (testers != null && !testers.isEmpty()) {
            for (ProjectUserDTO projectUserDTO : testers) {
                message
                    .append(messageSourceAccessor.getMessage("testrun.user.link", new Object[]{projectUserDTO.getUser().getName()}))
                    .append('\n')
                    .append(testrunUrl).append("?tester=").append(projectUserDTO.getUser().getId())
                    .append("\n\n");
            }
        }

        if (messageChannel.getMessageChannelType().equals(MessageChannelTypeCode.SLACK)) {
            sendSlack(messageChannel.getUrl(), message.toString());
        } else {
            sendWebhook(messageChannel, message.toString());
        }

    }

    /**
     * 테스트 실행의 테스터가 변경될 때 메시지를 보냅니다.
     *
     * @param messageChannel                 메시지가 전송될 채널입니다. 이것은 슬랙 채널이거나 웹훅일 수 있습니다.
     * @param spaceCode                      프로젝트가 위치한 공간의 코드입니다.
     * @param projectId                      테스트 실행이 시작되는 프로젝트의 ID입니다.
     * @param testrunId                      변경되는 테스트 실행의 ID입니다.
     * @param testrunTestcaseGroupTestcaseId 테스트 실행 테스트 케이스 그룹 테스트 케이스의 ID입니다.
     * @param testrunName                    변경되는 테스트 실행의 이름입니다.
     * @param testcaseName                   변경되는 테스트 케이스의 이름입니다.
     * @param beforeUserName                 변경 전 테스터의 이름입니다.
     * @param afterUserName                  변경 후 테스터의 이름입니다.
     */
    public void sendTestrunTesterChangeMessage(SpaceMessageChannelDTO messageChannel, String spaceCode, Long projectId, Long testrunId, Long testrunTestcaseGroupTestcaseId,
        String testrunName, String testcaseName, String beforeUserName, String afterUserName, String actorName) {
        StringBuilder message = new StringBuilder();
        String testrunUrl = webUrl + "/spaces/" + spaceCode + "/projects/" + projectId + "/testruns/" + testrunId + "?id=" + testrunTestcaseGroupTestcaseId + "&type=case";
        message
            .append(messageSourceAccessor.getMessage("testrun.tester.changed.actor", new Object[]{actorName}))
            .append(messageSourceAccessor.getMessage("testrun.tester.changed", new Object[]{testrunName, testcaseName, beforeUserName, afterUserName}))
            .append('\n')
            .append(testrunUrl);

        if (messageChannel.getMessageChannelType().equals(MessageChannelTypeCode.SLACK)) {
            sendSlack(messageChannel.getUrl(), message.toString());
        } else {
            sendWebhook(messageChannel, message.toString());
        }
    }

    /**
     * 테스트 실행의 테스터가 무작위로 변경될 때 메시지를 보냅니다.
     *
     * @param messageChannel                 메시지가 전송될 채널입니다. 이것은 슬랙 채널이거나 웹훅일 수 있습니다.
     * @param spaceCode                      프로젝트가 위치한 공간의 코드입니다.
     * @param projectId                      테스트 실행이 시작되는 프로젝트의 ID입니다.
     * @param testrunId                      변경되는 테스트 실행의 ID입니다.
     * @param testrunTestcaseGroupTestcaseId 테스트 실행 테스트 케이스 그룹 테스트 케이스의 ID입니다.
     * @param testrunName                    변경되는 테스트 실행의 이름입니다.
     * @param testcaseName                   변경되는 테스트 케이스의 이름입니다.
     * @param beforeUserName                 변경 전 테스터의 이름입니다.
     * @param afterUserName                  변경 후 테스터의 이름입니다.
     * @param reason                         테스터 변경의 이유입니다.
     */
    public void sendTestrunTesterRandomChangeMessage(SpaceMessageChannelDTO messageChannel, String spaceCode, Long projectId, Long testrunId,
        Long testrunTestcaseGroupTestcaseId, String testrunName, String testcaseName, String beforeUserName, String afterUserName, String reason) {
        StringBuilder message = new StringBuilder();
        String testrunUrl = webUrl + "/spaces/" + spaceCode + "/projects/" + projectId + "/testruns/" + testrunId + "?id=" + testrunTestcaseGroupTestcaseId + "&type=case";
        message
            .append(messageSourceAccessor.getMessage("testrun.tester.random.changed", new Object[]{testrunName, testcaseName, reason, beforeUserName, afterUserName}))
            .append('\n')
            .append(testrunUrl);

        if (messageChannel.getMessageChannelType().equals(MessageChannelTypeCode.SLACK)) {
            sendSlack(messageChannel.getUrl(), message.toString());
        } else {
            sendWebhook(messageChannel, message.toString());
        }
    }

    public void sendTestrunRemainInfo(SpaceMessageChannelDTO messageChannel, String spaceCode, Long projectId, String message, Long testrunId, String testrunName,
        List<ProjectUserDTO> testers, Map<Long, Integer> remainInfo) {
        StringBuilder messageInfo = new StringBuilder();
        String testrunUrl = webUrl + "/spaces/" + spaceCode + "/projects/" + projectId + "/testruns/" + testrunId;
        messageInfo
            .append(messageSourceAccessor.getMessage(message))
            .append('\n')
            .append(testrunUrl)
            .append("\n\n")
            .append(messageSourceAccessor.getMessage("testrun.not.tested.tester"))
            .append("\n\n");

        remainInfo.forEach((testerId, count) -> {
            Optional<ProjectUserDTO> projectUser = testers.stream().filter((projectUserDTO -> projectUserDTO.getUser().getId().equals(testerId))).findAny();
            String testerName = "";
            if (projectUser.isPresent()) {
                testerName = projectUser.get().getUser().getName();
            }
            messageInfo
                .append(messageSourceAccessor.getMessage("testrun.user.link.count", new Object[]{testerName, count}))
                .append('\n')
                .append(testrunUrl).append("?tester=").append(testerId)
                .append("\n\n");

        });

        if (messageChannel.getMessageChannelType().equals(MessageChannelTypeCode.SLACK)) {
            sendSlack(messageChannel.getUrl(), messageInfo.toString());
        } else {
            sendWebhook(messageChannel, messageInfo.toString());
        }
    }

    /**
     * 테스트 실행이 종료될 때 메시지를 보냅니다.
     *
     * @param messageChannel 메시지가 전송될 채널입니다. 이것은 슬랙 채널이거나 웹훅일 수 있습니다.
     * @param spaceCode      프로젝트가 위치한 공간의 코드입니다.
     * @param projectId      테스트 실행이 종료되는 프로젝트의 ID입니다.
     * @param testrun        테스트 실행에 대한 정보를 담고 있는 TestrunDTO 객체입니다.
     */
    public void sendTestrunClosedMessage(SpaceMessageChannelDTO messageChannel, String spaceCode, Long projectId, TestrunDTO testrun) {

        if (messageChannel == null) {
            return;
        }

        String reportUrl = webUrl + "/spaces/" + spaceCode + "/projects/" + projectId + "/reports/" + testrun.getId();
        StringBuilder message = new StringBuilder();
        message.append(messageSourceAccessor.getMessage("testrun.closed", new Object[]{testrun.getName()})).append("\n\n");

        float totalTestedCount = testrun.getPassedTestcaseCount() + testrun.getFailedTestcaseCount() + testrun.getUntestableTestcaseCount();
        float totalCount = testrun.getTotalTestcaseCount();
        float testedPercentage = 0;
        if (totalCount > 0) {
            testedPercentage = Math.round((totalTestedCount / totalCount) * 1000) / 10f;
        }

        float passedPercentage = 0;
        if (totalCount > 0) {
            passedPercentage = Math.round(((float) testrun.getPassedTestcaseCount() / totalCount) * 1000) / 10f;
        }

        float failedPercentage = 0;
        if (totalCount > 0) {
            failedPercentage = Math.round(((float) testrun.getFailedTestcaseCount() / totalCount) * 1000) / 10f;
        }

        float untestablePercentage = 0;
        if (totalCount > 0) {
            untestablePercentage = Math.round(((float) testrun.getUntestableTestcaseCount() / totalCount) * 1000) / 10f;
        }

        float untestedPercentage = 0;
        if (totalCount > 0) {
            untestedPercentage = Math.round(((totalCount - totalTestedCount) / totalCount) * 1000) / 10f;
        }

        message
            .append(messageSourceAccessor.getMessage("testrun.report.summary.progress", new Object[]{testedPercentage, totalTestedCount, totalCount}))
            .append('\n')
            .append(messageSourceAccessor.getMessage("testrun.report.summary.passed", new Object[]{passedPercentage, testrun.getPassedTestcaseCount(), totalCount}))
            .append('\n')
            .append(messageSourceAccessor.getMessage("testrun.report.summary.failed", new Object[]{failedPercentage, testrun.getFailedTestcaseCount(), totalCount}))
            .append('\n')
            .append(messageSourceAccessor.getMessage("testrun.report.summary.untestable", new Object[]{untestablePercentage, testrun.getUntestableTestcaseCount(), totalCount}))
            .append('\n')
            .append(messageSourceAccessor.getMessage("testrun.report.summary.untested", new Object[]{untestedPercentage, (totalCount - totalTestedCount), totalCount}))
            .append("\n\n")
            .append(messageSourceAccessor.getMessage("testrun.report.link"))
            .append('\n')
            .append(reportUrl);

        if (messageChannel.getMessageChannelType().equals(MessageChannelTypeCode.SLACK)) {
            this.sendSlack(messageChannel.getUrl(), message.toString());
        } else {
            sendWebhook(messageChannel, message.toString());
        }


    }


    public boolean sendTestMessage(SpaceMessageChannelDTO messageChannel) {

        String message = messageSourceAccessor.getMessage("message.channel.sample.message");

        if (messageChannel.getMessageChannelType().equals(MessageChannelTypeCode.SLACK)) {
            return sendSlack(messageChannel.getUrl(), message);
        } else {
            return sendWebhook(messageChannel, message);
        }
    }

}
