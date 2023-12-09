package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileVariableDTO;
import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
import com.mindplates.bugcase.biz.space.entity.SpaceProfileVariable;
import com.mindplates.bugcase.biz.space.entity.SpaceVariable;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileVariableRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class SpaceProfileVariableService {

    private final SpaceProfileRepository spaceProfileRepository;
    private final SpaceProfileVariableRepository spaceProfileVariableRepository;
    private final MappingUtil mappingUtil;

    public List<SpaceProfileVariableDTO> selectSpaceProfileVariableList(String spaceCode) {
        List<SpaceProfileVariable> spaceProfileVariableList = spaceProfileVariableRepository.findAllBySpaceCode(spaceCode);
        return spaceProfileVariableList.stream().map(SpaceProfileVariableDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public SpaceProfileVariableDTO createOrUpdateSpaceProfileVariableInfo(SpaceProfileVariableDTO createSpaceProfileVariableInfo) {

        Optional<SpaceProfileVariable> spaceProfileVariable = spaceProfileVariableRepository.findBySpaceCodeAndSpaceVariableIdAndSpaceProfileId(
            createSpaceProfileVariableInfo.getSpace().getCode(),
            createSpaceProfileVariableInfo.getSpaceVariable().getId(), createSpaceProfileVariableInfo.getSpaceProfile().getId());

        SpaceProfileVariable target;
        if (spaceProfileVariable.isPresent()) {
            target = spaceProfileVariable.get();
            target.setValue(createSpaceProfileVariableInfo.getValue());
        } else {
            target = SpaceProfileVariable
                .builder()
                .value(createSpaceProfileVariableInfo.getValue())
                .space(Space.builder().id(createSpaceProfileVariableInfo.getSpace().getId()).build())
                .spaceVariable(SpaceVariable.builder().id(createSpaceProfileVariableInfo.getSpaceVariable().getId()).build())
                .spaceProfile(SpaceProfile.builder().id(createSpaceProfileVariableInfo.getSpaceProfile().getId()).build())
                .build();
        }
        spaceProfileVariableRepository.save(target);
        return new SpaceProfileVariableDTO(target);
    }

    @Transactional
    public void deleteSpaceProfileVariableInfo(String spaceCode, long spaceVariableId, long spaceProfileId) {
        SpaceProfileVariable spaceProfileVariable = spaceProfileVariableRepository.findBySpaceCodeAndSpaceVariableIdAndSpaceProfileId(spaceCode, spaceVariableId, spaceProfileId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        spaceProfileVariableRepository.delete(spaceProfileVariable);
    }


    public SpaceProfileVariableDTO selectSpaceProfileVariableList(String spaceCode, long id) {
        SpaceProfileVariable spaceProfileVariable = spaceProfileVariableRepository.findBySpaceCodeAndId(spaceCode, id)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceProfileVariableDTO(spaceProfileVariable);
    }

    @Transactional
    public void deleteSpaceProfileVariableInfo(long spaceId, long id) {
        spaceProfileVariableRepository.deleteBySpaceIdAndSpaceProfileId(spaceId, id);
    }


    @Transactional
    public SpaceProfileVariableDTO updateProfileVariableInfo(SpaceProfileVariableDTO updateSpaceProfileVariableInfo) {
        SpaceProfileVariable spaceProfileVariable = spaceProfileVariableRepository.findById(updateSpaceProfileVariableInfo.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        spaceProfileVariable.setValue(updateSpaceProfileVariableInfo.getValue());
        return new SpaceProfileVariableDTO(spaceProfileVariableRepository.save(spaceProfileVariable));
    }


}
