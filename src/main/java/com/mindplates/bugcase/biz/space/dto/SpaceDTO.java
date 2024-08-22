package com.mindplates.bugcase.biz.space.dto;

import com.mindplates.bugcase.biz.ai.dto.LlmDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.dto.CommonDTO;
import com.mindplates.bugcase.common.vo.IDTO;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@EqualsAndHashCode(callSuper = false)
public class SpaceDTO extends CommonDTO implements IDTO<Space> {

    private Long id;
    private String name;
    private String code;
    private String description;
    private boolean activated;
    private boolean allowSearch;
    private boolean allowAutoJoin;
    private String token;
    private String country;
    private String timeZone;
    private List<SpaceUserDTO> users;
    private List<SpaceApplicantDTO> applicants;
    private List<SpaceMessageChannelDTO> messageChannels;
    private List<HolidayDTO> holidays;
    private List<LlmDTO> llms;
    private List<SpaceLlmPromptDTO> llmPrompts;
    private Long projectCount;
    private Long userCount;
    private boolean isMember;
    private boolean isAdmin;

    public SpaceDTO(Space space) {
        this.id = space.getId();
        this.name = space.getName();
        this.code = space.getCode();
        this.activated = space.isActivated();
        this.description = space.getDescription();
        this.allowSearch = space.isAllowSearch();
        this.allowAutoJoin = space.isAllowAutoJoin();
        this.token = space.getToken();
        this.country = space.getCountry();
        this.timeZone = space.getTimeZone();
        this.projectCount = space.getProjectCount();
        this.userCount = space.getUserCount();
        this.isMember = space.isMember();
        this.isAdmin = space.isAdmin();

        if (space.getUsers() != null) {
            this.users = space.getUsers().stream().map(SpaceUserDTO::new).collect(Collectors.toList());
        }

        if (space.getApplicants() != null) {
            this.applicants = space.getApplicants().stream().map(SpaceApplicantDTO::new).collect(Collectors.toList());
        }

        if (space.getHolidays() != null) {
            this.holidays = space.getHolidays().stream().map(HolidayDTO::new).collect(Collectors.toList());
        }

        if (space.getMessageChannels() != null) {
            this.messageChannels = space.getMessageChannels().stream().map(SpaceMessageChannelDTO::new).collect(Collectors.toList());
        }

        if (space.getLlms() != null) {
            this.llms = space.getLlms().stream().map(LlmDTO::new).collect(Collectors.toList());
        }

        if (space.getLlmPrompts() != null) {
            this.llmPrompts = space.getLlmPrompts().stream().map(SpaceLlmPromptDTO::new).collect(Collectors.toList());
        }
    }


    @Override
    public Space toEntity() {
        Space space = Space.builder().id(id).name(name).code(code).description(description).activated(activated).allowSearch(allowSearch).allowAutoJoin(allowAutoJoin).token(token).country(country)
            .timeZone(timeZone).build();

        if (users != null) {
            space.setUsers(users.stream().map((spaceUserDTO -> spaceUserDTO.toEntity(space))).collect(Collectors.toList()));
        } else {
            space.setUsers(Collections.emptyList());
        }

        if (applicants != null) {
            space.setApplicants(applicants.stream().map(spaceApplicantDTO -> spaceApplicantDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setApplicants(Collections.emptyList());
        }

        if (holidays != null) {
            space.setHolidays(holidays.stream().map((holidayDTO -> holidayDTO.toEntity(space))).collect(Collectors.toList()));
        } else {
            space.setHolidays(Collections.emptyList());
        }

        if (messageChannels != null) {
            space.setMessageChannels(messageChannels.stream().map(spaceMessageChannelDTO -> spaceMessageChannelDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setMessageChannels(Collections.emptyList());
        }

        if (llms != null) {
            space.setLlms(llms.stream().map(llmDTO -> llmDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setLlms(Collections.emptyList());
        }

        if (llmPrompts != null) {
            space.setLlmPrompts(llmPrompts.stream().map(spaceLlmPromptDTO -> spaceLlmPromptDTO.toEntity(space)).collect(Collectors.toList()));
        } else {
            space.setLlmPrompts(Collections.emptyList());
        }

        return space;
    }

    public void updateLlmPrompts(List<SpaceLlmPromptDTO> updateLlmPrompts) {
        if (updateLlmPrompts == null || updateLlmPrompts.isEmpty()) {
            if (this.llmPrompts != null && !this.llmPrompts.isEmpty()) {
                this.llmPrompts.clear();
            }
        } else {
            List<Long> deleteLlmIds = this.llmPrompts.stream()
                .map(SpaceLlmPromptDTO::getId)
                .filter(llmPromptId -> updateLlmPrompts.stream().noneMatch((updateLlmPrompt -> updateLlmPrompt.getId() != null && updateLlmPrompt.getId().equals(llmPromptId))))
                .collect(Collectors.toList());

            this.llmPrompts.removeIf((llmPrompt -> deleteLlmIds.contains(llmPrompt.getId())));

            updateLlmPrompts.forEach((updateLlmPrompt -> {
                SpaceLlmPromptDTO targetLlmPrompt = this.llmPrompts.stream().filter((llmPrompt -> llmPrompt.getId() != null && llmPrompt.getId().equals(updateLlmPrompt.getId()))).findAny()
                    .orElse(null);
                if (targetLlmPrompt != null) {
                    targetLlmPrompt.setName(updateLlmPrompt.getName());
                    targetLlmPrompt.setSystemRole(updateLlmPrompt.getSystemRole());
                    targetLlmPrompt.setPrompt(updateLlmPrompt.getPrompt());
                    targetLlmPrompt.setActivated(updateLlmPrompt.isActivated());
                    targetLlmPrompt.setSpace(SpaceDTO.builder().id(this.id).build());
                } else {
                    this.llmPrompts.add(updateLlmPrompt);
                }
            }));

        }
    }

    public void updateLlms(List<LlmDTO> updateLlms) {
        if (updateLlms == null || updateLlms.isEmpty()) {
            if (this.llms != null && !this.llms.isEmpty()) {
                this.llms.clear();
            }
        } else {
            List<Long> deleteLlmIds = this.llms.stream()
                .map(LlmDTO::getId)
                .filter(id -> updateLlms.stream().noneMatch((updateLlm -> updateLlm.getId() != null && updateLlm.getId().equals(id))))
                .collect(Collectors.toList());

            this.llms.removeIf((llm -> deleteLlmIds.contains(llm.getId())));

            updateLlms.forEach((updateLlm -> {
                if (updateLlm.getId() == null) {
                    this.llms.add(updateLlm);
                } else {
                    LlmDTO targetLlm = this.llms.stream().filter((llm -> llm.getId().equals(updateLlm.getId()))).findAny().orElse(null);
                    if (targetLlm != null) {
                        targetLlm.setLlmTypeCode(updateLlm.getLlmTypeCode());
                        targetLlm.setActivated(updateLlm.isActivated());
                        targetLlm.getOpenAi().setName(updateLlm.getOpenAi().getName());
                        // targetLlm.getOpenAi().setUrl(updateLlm.getOpenAi().getUrl());
                        // targetLlm.getOpenAi().setApiKey(updateLlm.getOpenAi().getApiKey());
                    }
                }

            }));
        }
    }

    public void updateUsers(List<SpaceUserDTO> updateUsers) {
        updateUsers.forEach((spaceUser -> {
            if ("D".equals(spaceUser.getCrud())) {
                this.users.removeIf((currentUser -> currentUser.getId().equals(spaceUser.getId())));
                this.applicants.removeIf((spaceApplicant -> spaceApplicant.getUser().getId().equals(spaceUser.getUser().getId())));

            } else if ("U".equals(spaceUser.getCrud())) {
                this.users.stream().filter((currentUser -> currentUser.getId().equals(spaceUser.getId()))).findAny().ifPresent(updateUser -> updateUser.setRole(spaceUser.getRole()));
            }
        }));
    }

    public List<Long> getBannedUserIds(List<SpaceUserDTO> users) {
        // crud가 D인 userId 반환
        return users.stream().filter((spaceUser -> "D".equals(spaceUser.getCrud()))).map((spaceUserDTO -> spaceUserDTO.getUser().getId())).collect(Collectors.toList());
    }

    public List<Map<String, String>> getRoleChangedUsers(List<SpaceUserDTO> updateUsers) {
        // crud가 U인 사용자의 변경 전 Role과 변경 후 Role이 다른 경우, Map에 before, after로 저장하여 반환
        List<Map<String, String>> result = new ArrayList<>();
        updateUsers.stream()
            .filter((spaceUser -> "U".equals(spaceUser.getCrud())))
            .forEach((spaceUser -> {
                SpaceUserDTO targetUser = this.users.stream().filter((currentUser -> currentUser.getId().equals(spaceUser.getId()))).findAny().orElse(null);
                if (targetUser != null && !targetUser.getRole().equals(spaceUser.getRole())) {
                    Map<String, String> roleMap = new HashMap<>();
                    roleMap.put("userId", spaceUser.getUser().getId().toString());
                    roleMap.put("beforeRole", targetUser.getRole().toString());
                    roleMap.put("afterRole", spaceUser.getRole().toString());
                    result.add(roleMap);
                }
            }));

        return result;
    }


    public List<Long> getRemoveTargetMessageChannels(List<SpaceMessageChannelDTO> updateMessageChannels) {

        if (this.messageChannels == null || this.messageChannels.isEmpty()) {
            return new ArrayList<>();
        }

        return this.messageChannels.stream().map(SpaceMessageChannelDTO::getId)
            .filter((id -> updateMessageChannels.stream().noneMatch((updateMessageChannel -> updateMessageChannel.getId() != null && updateMessageChannel.getId().equals(id)))))
            .collect(Collectors.toList());

    }

    public void updateMessageChannels(List<SpaceMessageChannelDTO> messageChannels) {

        if (messageChannels == null || messageChannels.isEmpty()) {
            this.messageChannels.clear();
        } else {
            List<Long> deleteMessageChannelIds = this.messageChannels.stream()
                .map(SpaceMessageChannelDTO::getId)
                .filter((id -> messageChannels.stream()
                    .noneMatch((updateMessageChannel -> updateMessageChannel.getId() != null && updateMessageChannel.getId().equals(id)))))
                .collect(Collectors.toList());

            this.messageChannels.removeIf((projectMessageChannel -> deleteMessageChannelIds.contains(projectMessageChannel.getId())));

            messageChannels.forEach((updateChannel -> {
                if (updateChannel.getId() == null) {
                    this.messageChannels.add(updateChannel);
                } else {
                    SpaceMessageChannelDTO targetChannel = this.messageChannels.stream().filter((channel -> channel.getId().equals(updateChannel.getId()))).findAny().orElse(null);
                    if (targetChannel != null) {
                        targetChannel.setName(updateChannel.getName());
                        targetChannel.setUrl(updateChannel.getUrl());
                        targetChannel.setHttpMethod(updateChannel.getHttpMethod());
                        targetChannel.setMessageChannelType(updateChannel.getMessageChannelType());
                        targetChannel.setPayloadType(updateChannel.getPayloadType());
                        targetChannel.setJson(updateChannel.getJson());

                        // updateChannel의 header를 id가 존재하는지에 따라 업데이터 및 추가 처리
                        targetChannel.getHeaders().removeIf((header -> updateChannel.getHeaders().stream().noneMatch((updateHeader -> updateHeader.getId().equals(header.getId())))));
                        updateChannel.getHeaders().forEach((updateHeader -> {
                            if (updateHeader.getId() == null) {
                                targetChannel.getHeaders().add(updateHeader);
                            } else {
                                SpaceMessageChannelHeaderDTO targetHeader = targetChannel.getHeaders().stream().filter((header -> header.getId().equals(updateHeader.getId()))).findAny().orElse(null);
                                if (targetHeader != null) {
                                    targetHeader.setDataKey(updateHeader.getDataKey());
                                    targetHeader.setDataValue(updateHeader.getDataValue());
                                }
                            }
                        }));

                        // updateChannel의 payloads를 id가 존재하는지에 따라 업데이터 및 추가 처리
                        targetChannel.getPayloads().removeIf((payload -> updateChannel.getPayloads().stream().noneMatch((updatePayload -> updatePayload.getId().equals(payload.getId())))));
                        updateChannel.getPayloads().forEach((updatePayload -> {
                            if (updatePayload.getId() == null) {
                                targetChannel.getPayloads().add(updatePayload);
                            } else {
                                SpaceMessageChannelPayloadDTO targetPayload = targetChannel.getPayloads().stream().filter((payload -> payload.getId().equals(updatePayload.getId()))).findAny()
                                    .orElse(null);
                                if (targetPayload != null) {
                                    targetPayload.setDataKey(updatePayload.getDataKey());
                                    targetPayload.setDataValue(updatePayload.getDataValue());
                                }
                            }
                        }));

                    }
                }
            }));

        }


    }


}
