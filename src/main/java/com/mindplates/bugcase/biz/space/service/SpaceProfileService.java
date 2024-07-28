package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileVariableRepository;
import com.mindplates.bugcase.biz.testrun.repository.TestrunProfileRepository;
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
public class SpaceProfileService {

    private final SpaceProfileRepository spaceProfileRepository;
    private final SpaceProfileVariableRepository spaceProfileVariableRepository;
    private final TestrunProfileRepository testrunProfileRepository;

    private boolean existByName(long spaceId, String name) {
        Long count = spaceProfileRepository.countBySpaceIdAndName(spaceId, name);
        return count > 0;
    }


    @Cacheable(key = "#spaceCode", value = CacheConfig.SPACE_PROFILE)
    public List<SpaceProfileDTO> selectSpaceProfileList(String spaceCode) {
        List<SpaceProfile> spaceProfileList = spaceProfileRepository.findAllBySpaceCode(spaceCode);
        return spaceProfileList.stream().map(SpaceProfileDTO::new).collect(Collectors.toList());
    }

    public SpaceProfileDTO selectSpaceProfileInfo(String spaceCode, long id) {
        SpaceProfile spaceProfile = spaceProfileRepository.findBySpaceCodeAndId(spaceCode, id)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceProfileDTO(spaceProfile);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE_PROFILE)
    @Transactional
    public void deleteSpaceProfileInfo(String spaceCode, long spaceId, long id) {
        spaceProfileVariableRepository.deleteBySpaceIdAndSpaceProfileId(spaceId, id);
        testrunProfileRepository.deleteByProfileId(id);
        spaceProfileRepository.deleteById(id);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE_PROFILE)
    @Transactional
    public SpaceProfileDTO createSpaceProfileInfo(String spaceCode, SpaceProfileDTO createSpaceProfileInfo) {

        if (existByName(createSpaceProfileInfo.getSpace().getId(), createSpaceProfileInfo.getName())) {
            throw new ServiceException("error.space.profile.code.duplicated");
        }

        SpaceProfile result = spaceProfileRepository.save(createSpaceProfileInfo.toEntity());
        return new SpaceProfileDTO(result);
    }

    @CacheEvict(key = "#spaceCode", value = CacheConfig.SPACE_PROFILE)
    @Transactional
    public SpaceProfileDTO updateProfileSpaceInfo(String spaceCode, SpaceProfileDTO updateSpaceProfileInfo) {
        SpaceProfile spaceProfile = spaceProfileRepository.findById(updateSpaceProfileInfo.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        spaceProfile.setName(updateSpaceProfileInfo.getName());
        spaceProfile.setDefault(updateSpaceProfileInfo.isDefault());

        return new SpaceProfileDTO(spaceProfileRepository.save(spaceProfile));
    }


}
