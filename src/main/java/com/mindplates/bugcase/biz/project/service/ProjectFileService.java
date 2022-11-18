package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
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
public class ProjectFileService {

    private final ProjectFileRepository projectFileRepository;

    private final List<String> allowedExtensions;
    private final Path fileStorageLocation;
    private final FileUtil fileUtil;

    public ProjectFileService(FileConfig fileConfig, ProjectFileRepository projectFileRepository, FileUtil fileUtil) {

        this.fileUtil = fileUtil;
        this.projectFileRepository = projectFileRepository;

        this.fileStorageLocation = Paths.get(fileConfig.getUploadDir()).toAbsolutePath().normalize();
        this.allowedExtensions = Arrays.asList(fileConfig.getAllowedExtension().split(","));

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new ServiceException("image.upload.failed");
        }
    }

    public ProjectFile createProjectFile(ProjectFile projectFile) {
        projectFileRepository.save(projectFile);
        return projectFile;
    }

    public ProjectFile selectProjectFile(Long projectId, Long imageId, String uuid) {
        return projectFileRepository.findByIdAndProjectIdAndUuid(imageId, projectId, uuid).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
    }

    public void deleteProjectFile(Long projectId) {

        List<ProjectFile> projectFiles = projectFileRepository.findAllByProjectId(projectId);

        projectFiles.forEach((projectFile -> {
            Path filePath = this.fileStorageLocation.resolve(projectFile.getPath()).normalize();
            if (Files.exists(filePath)) {
                try {
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    // ignore
                }
            }
            projectFileRepository.delete(projectFile);
        }));
    }

    public String createImage(Long projectId, MultipartFile file) {
        if (!allowedExtensions.stream().anyMatch(p -> file.getOriginalFilename().endsWith(p))) {
            throw new ServiceException("file.error.uploadextension");
        }

        return fileUtil.storeFile(projectId, file);
    }


}
