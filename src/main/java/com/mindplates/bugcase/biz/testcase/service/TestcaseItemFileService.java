package com.mindplates.bugcase.biz.testcase.service;

import com.mindplates.bugcase.biz.testcase.repository.TestcaseItemFileRepository;
import com.mindplates.bugcase.biz.testcase.entity.TestcaseItemFile;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.FileConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
public class TestcaseItemFileService {

    private List<String> allowedExtensions;
    private Path fileStorageLocation;

    private final TestcaseItemFileRepository testcaseItemFileRepository;

    private final FileConfig fileConfig;


    public TestcaseItemFileService(FileConfig fileConfig, TestcaseItemFileRepository testcaseItemFileRepository) {
        this.fileConfig = fileConfig;
        this.testcaseItemFileRepository = testcaseItemFileRepository;

        this.fileStorageLocation = Paths.get(fileConfig.getUploadDir()).toAbsolutePath().normalize();
        this.allowedExtensions = Arrays.asList(fileConfig.getAllowedExtension().split(","));

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new ServiceException("image.upload.failed");
        }
    }

    public TestcaseItemFile createTestcaseItemFile(TestcaseItemFile projectFile) {
        testcaseItemFileRepository.save(projectFile);
        return projectFile;
    }

    public TestcaseItemFile selectTestcaseItemFile(Long projectId, Long testcaseId, Long imageId) {
        return testcaseItemFileRepository.findByProjectIdAndTestcaseIdAndId(projectId, testcaseId, imageId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }


    public String createImage(Long projectId, MultipartFile file, HttpServletRequest req) {
        if (!allowedExtensions.stream().anyMatch(p -> file.getOriginalFilename().endsWith(p))) {
            throw new ServiceException("file.error.uploadextension");
        }

        return this.storeFile(projectId, file);
    }

    public Resource loadFileAsResource(String path) {
        try {
            Path filePath = this.fileStorageLocation.resolve(path).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                throw new ServiceException(HttpStatus.NOT_FOUND);
            }
        } catch (MalformedURLException ex) {
            throw new ServiceException(HttpStatus.NOT_FOUND);
        }
    }

    public String storeFile(Long projectId, MultipartFile file) {
        Path path = this.fileStorageLocation.resolve(File.separator + file.getOriginalFilename());
        while (Files.exists(path)) {
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            path = this.fileStorageLocation.resolve(File.separator + file.getOriginalFilename() + "." + timestamp.getTime());
        }

        Path targetLocation = null;
        String savePath = StringUtils.cleanPath(path.getFileName().toString());

        try {
            Path projectUploadDir = this.fileStorageLocation.resolve(Long.toString(projectId));
            if (!Files.exists(projectUploadDir)) {
                Files.createDirectories(projectUploadDir.normalize());
            }
            targetLocation = projectUploadDir.resolve(savePath);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return Long.toString(projectId) + File.separator + savePath;
        } catch (Exception ex) {
            try {
                if (targetLocation != null) Files.deleteIfExists(targetLocation);
            } catch (IOException e) {
                log.error("File delete error", e);

            }
            throw new ServiceException("image.upload.failed");
        }

    }


}
