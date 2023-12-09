package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.dto.SpaceVariableDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceVariable;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileVariableRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceVariableRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.MappingUtil;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class SpaceVariableService {

    private final SpaceVariableRepository spaceVariableRepository;
    private final SpaceProfileVariableRepository spaceProfileVariableRepository;
    private final SpaceProfileRepository spaceProfileRepository;
    private final MappingUtil mappingUtil;

    private boolean existByName(long spaceId, String name) {
        Long count = spaceVariableRepository.countBySpaceIdAndName(spaceId, name);
        return count > 0;
    }

    public List<SpaceVariableDTO> selectSpaceVariableList(String spaceCode) {
        List<SpaceVariable> spaceVariableList = spaceVariableRepository.findAllBySpaceCode(spaceCode);
        return spaceVariableList.stream().map(SpaceVariableDTO::new).collect(Collectors.toList());
    }

    public SpaceVariableDTO selectSpaceVariableInfo(String spaceCode, long id) {
        SpaceVariable spaceVariable = spaceVariableRepository.findBySpaceCodeAndId(spaceCode, id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceVariableDTO(spaceVariable);
    }

    @Transactional
    public void deleteSpaceVariableInfo(long spaceId, long id) {
        spaceProfileVariableRepository.deleteBySpaceIdAndSpaceVariableId(spaceId, id);
        spaceVariableRepository.deleteById(id);
    }

    @Transactional
    public SpaceVariableDTO createSpaceVariableInfo(SpaceVariableDTO createSpaceVariableInfo) {

        if (existByName(createSpaceVariableInfo.getSpace().getId(), createSpaceVariableInfo.getName())) {
            throw new ServiceException("error.space.variable.code.duplicated");
        }

        SpaceVariable spaceVariable = mappingUtil.convert(createSpaceVariableInfo, SpaceVariable.class);
        spaceVariableRepository.save(spaceVariable);
        return new SpaceVariableDTO(spaceVariable);
    }

    @Transactional
    public SpaceVariableDTO updateVariableSpaceInfo(SpaceVariableDTO updateSpaceVariableInfo) {
        SpaceVariable spaceVariable = spaceVariableRepository.findById(updateSpaceVariableInfo.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        spaceVariable.setName(updateSpaceVariableInfo.getName());
        return new SpaceVariableDTO(spaceVariableRepository.save(spaceVariable));
    }


}
