package com.mindplates.bugcase.biz.space.service;

import com.mindplates.bugcase.biz.space.dto.SpaceProfileDTO;
import com.mindplates.bugcase.biz.space.dto.SpaceVariableDTO;
import com.mindplates.bugcase.biz.space.entity.SpaceProfile;
import com.mindplates.bugcase.biz.space.entity.SpaceVariable;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileRepository;
import com.mindplates.bugcase.biz.space.repository.SpaceProfileVariableRepository;
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
public class SpaceProfileService {

    private final SpaceProfileRepository spaceProfileRepository;
    private final SpaceProfileVariableRepository spaceProfileVariableRepository;
    private final MappingUtil mappingUtil;

    private boolean existByName(long spaceId, String name) {
        Long count = spaceProfileRepository.countBySpaceIdAndName(spaceId, name);
        return count > 0;
    }

    public List<SpaceProfileDTO> selectSpaceProfileList(String spaceCode) {
        List<SpaceProfile> spaceProfileList = spaceProfileRepository.findAllBySpaceCode(spaceCode);
        return spaceProfileList.stream().map(SpaceProfileDTO::new).collect(Collectors.toList());
    }

    public SpaceProfileDTO selectSpaceProfileInfo(String spaceCode, long id) {
        SpaceProfile spaceProfile = spaceProfileRepository.findBySpaceCodeAndId(spaceCode, id)
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SpaceProfileDTO(spaceProfile);
    }

    @Transactional
    public void deleteSpaceProfileInfo(long spaceId, long id) {
        spaceProfileVariableRepository.deleteBySpaceIdAndSpaceProfileId(spaceId, id);
        spaceProfileRepository.deleteById(id);
    }

    @Transactional
    public SpaceProfileDTO createSpaceProfileInfo(SpaceProfileDTO createSpaceProfileInfo) {

        if (existByName(createSpaceProfileInfo.getSpace().getId(), createSpaceProfileInfo.getName())) {
            throw new ServiceException("error.space.profile.code.duplicated");
        }

        SpaceProfile spaceProfile = mappingUtil.convert(createSpaceProfileInfo, SpaceProfile.class);
        spaceProfileRepository.save(spaceProfile);
        return new SpaceProfileDTO(spaceProfile);
    }

    @Transactional
    public SpaceProfileDTO updateProfileSpaceInfo(SpaceProfileDTO updateSpaceProfileInfo) {
        SpaceProfile spaceProfile = spaceProfileRepository.findById(updateSpaceProfileInfo.getId())
            .orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        spaceProfile.setName(updateSpaceProfileInfo.getName());
        return new SpaceProfileDTO(spaceProfileRepository.save(spaceProfile));
    }


}
