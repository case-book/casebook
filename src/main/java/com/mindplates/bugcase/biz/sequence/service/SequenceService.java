package com.mindplates.bugcase.biz.sequence.service;

import com.mindplates.bugcase.biz.sequence.dto.SequenceDTO;
import com.mindplates.bugcase.biz.sequence.dto.SequenceListDTO;
import com.mindplates.bugcase.biz.sequence.entity.Sequence;
import com.mindplates.bugcase.biz.sequence.repository.SequenceRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SequenceService {

    private final SequenceRepository sequenceRepository;

    @Transactional
    public SequenceDTO createSequenceInfo(String spaceCode, long projectId, SequenceDTO sequenceInfo) {

        if (existByName(projectId, sequenceInfo.getName())) {
            throw new ServiceException("error.sequence.duplicated");
        }

        Sequence sequence = sequenceInfo.toEntity();
        return new SequenceDTO(sequenceRepository.save(sequence));
    }


    public List<SequenceListDTO> selectProjectSequenceList(long projectId) {
        List<Sequence> sequences = sequenceRepository.findByProjectIdOrderByNameDesc(projectId);
        return sequences.stream().map((SequenceListDTO::new)).collect(Collectors.toList());
    }

    public SequenceDTO selectSequenceInfo(long sequenceId) {
        Sequence sequence = sequenceRepository.findById(sequenceId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new SequenceDTO(sequence);
    }

    @Transactional
    public SequenceDTO updateSequenceInfo(String spaceCode, long projectId, long sequenceId, SequenceDTO updateSequenceInfo) {
        Sequence targetSequence = sequenceRepository.findById(sequenceId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        targetSequence.updateInfo(updateSequenceInfo);
        return new SequenceDTO(sequenceRepository.save(targetSequence));
    }

    @Transactional
    public void deleteSequenceInfo(String spaceCode, long projectId, long sequenceId) {
        Sequence sequence = sequenceRepository.findById(sequenceId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        sequenceRepository.delete(sequence);
    }

    public boolean existByName(long projectId, String name) {
        Long count = sequenceRepository.countByProjectIdAndName(projectId, name);
        return count > 0;
    }

}
