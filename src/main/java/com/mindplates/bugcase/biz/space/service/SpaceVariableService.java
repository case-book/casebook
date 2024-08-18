package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.dto.SpaceVariableDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceVariable;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileVariableRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceVariableRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.util.List;
import java.util.stream.Collectors;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Slf4j
public class SpaceVariableService {

    private final SpaceVariableRepository spaceVariableRepository;
    private final SpaceProfileVariableRepository spaceProfileVariableRepository;

    private boolean existByName(long spaceId, String name) {
        Long count = spaceVariableRepository.countBySpaceIdAndName(spaceId, name);
        return count > 0;
    }

    @Cacheable(key = "#spaceCode", value = CacheConfig.SPACE_VARIABLE)
    public List<SpaceVariableDTO> selectSpaceVariableList(String spaceCode) {
        List<SpaceVariable> spaceVariableList = spaceVariableRepository.findAllBySpaceCode(spaceCode);
        return spaceVariableList.stream().map(SpaceVariableDTO::new).collect(Collectors.toList());
    }

    public SpaceVariableDTO selectSpaceVariableInfo(String spaceCode, long id) {
        SpaceVariable spaceVariable = spaceVariableRepository.findBySpaceCodeAndId(spaceCode, id)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceVariableDTO(spaceVariable);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE_VARIABLE)
    @Transactional
    public void deleteSpaceVariableInfo(String spaceCode, long spaceId, long id) {
        spaceProfileVariableRepository.deleteBySpaceIdAndSpaceVariableId(spaceId, id);
        spaceVariableRepository.deleteById(id);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE_VARIABLE)
    @Transactional
    public SpaceVariableDTO createSpaceVariableInfo(String spaceCode, SpaceVariableDTO createSpaceVariableInfo) {

        if (existByName(createSpaceVariableInfo.getSpace().getId(), createSpaceVariableInfo.getName())) {
            throw new ServiceException("error.space.variable.code.duplicated");
        }

        SpaceVariable result = spaceVariableRepository.save(createSpaceVariableInfo.toEntity());
        return new SpaceVariableDTO(result);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE_VARIABLE)
    @Transactional
    public SpaceVariableDTO updateVariableSpaceInfo(String spaceCode, SpaceVariableDTO updateSpaceVariableInfo) {
        SpaceVariable spaceVariable = spaceVariableRepository.findById(updateSpaceVariableInfo.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        spaceVariable.setName(updateSpaceVariableInfo.getName());
        return new SpaceVariableDTO(spaceVariableRepository.save(spaceVariable));
    }


}
