package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.testcase.dto.TestcaseFileDTO;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseFile;
import com.mindplates.bugcase.biz.testcase.repository.TestcaseFileRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import com.mindplates.bugcase.framework.config.FileConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class TestcaseFileService {

    private final TestcaseFileRepository testcaseFileRepository;

    private final List<String> allowedExtensions;
    private final Path fileStorageLocation;

    private final FileUtil fileUtil;

    private final MappingUtil mappingUtil;

    public TestcaseFileService(FileConfig fileConfig, TestcaseFileRepository testcaseFileRepository, FileUtil fileUtil, MappingUtil mappingUtil) {
        this.fileUtil = fileUtil;
        this.testcaseFileRepository = testcaseFileRepository;

        this.mappingUtil = mappingUtil;
        this.fileStorageLocation = Paths.get(fileConfig.getUploadDir()).toAbsolutePath().normalize();
        this.allowedExtensions = Arrays.asList(fileConfig.getAllowedExtension().split(","));

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new ServiceException("image.upload.failed");
        }
    }

    public TestcaseFileDTO createTestcaseFile(TestcaseFileDTO projectFile) {
        TestcaseFile file = mappingUtil.convert(projectFile, TestcaseFile.class);
        TestcaseFile result = testcaseFileRepository.save(file);
        return mappingUtil.convert(result, TestcaseFileDTO.class);
    }

    public TestcaseFileDTO selectTestcaseFile(Long projectId, Long testcaseId, Long imageId, String uuid) {
        TestcaseFile testcaseFile = testcaseFileRepository.findByIdAndProjectIdAndTestcaseIdAndUuid(imageId, projectId, testcaseId, uuid).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return mappingUtil.convert(testcaseFile, TestcaseFileDTO.class);
    }

    public void deleteProjectTestcaseFile(Long projectId) {

        List<TestcaseFile> projectTestcaseFiles = testcaseFileRepository.findAllByProjectId(projectId);

        projectTestcaseFiles.forEach((testcaseFile -> {
            Path filePath = this.fileStorageLocation.resolve(testcaseFile.getPath()).normalize();
            if (Files.exists(filePath)) {
                try {
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    // ignore
                }
            }
            testcaseFileRepository.delete(testcaseFile);
        }));
    }

    public String createImage(Long projectId, MultipartFile file) {
        if (!allowedExtensions.stream().anyMatch(p -> file.getOriginalFilename().endsWith(p))) {
            throw new ServiceException("file.error.uploadextension");
        }

        return fileUtil.storeFile(projectId, file);
    }


}
