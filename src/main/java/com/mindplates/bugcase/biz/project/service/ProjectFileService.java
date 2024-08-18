package com.mindplates.bugcase.biz.project.service;

import com.mindplates.bugcase.biz.project.dto.ProjectFileDTO;
import com.mindplates.bugcase.biz.project.entity.ProjectFile;
import com.mindplates.bugcase.biz.project.repository.ProjectFileRepository;
import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.FileUtil;
import com.mindplates.bugcase.framework.config.FileConfig;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class ProjectFileService {

    private final ProjectFileRepository projectFileRepository;
    private final Path fileStorageLocation;
    private final FileUtil fileUtil;

    public ProjectFileService(FileConfig fileConfig, ProjectFileRepository projectFileRepository, FileUtil fileUtil) {
        this.fileUtil = fileUtil;
        this.projectFileRepository = projectFileRepository;
        this.fileStorageLocation = Paths.get(fileConfig.getUploadDir()).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new ServiceException("error.image.upload.failed");
        }
    }

    private ProjectFileDTO createFile(long projectId, String name, Long size, String type, MultipartFile file) {
        ProjectFileDTO projectFile = new ProjectFileDTO(projectId, name, size, type, file);
        String path = fileUtil.createImage(projectId, file);
        projectFile.setPath(path);
        return projectFile;
    }

    public ProjectFileDTO createProjectFile(long projectId, String name, Long size, String type, MultipartFile multipartFile) {
        ProjectFileDTO file = createFile(projectId, name, size, type, multipartFile);
        file.setFileSourceType(FileSourceTypeCode.PROJECT);
        return new ProjectFileDTO(projectFileRepository.save(file.toEntity()));
    }

    public ProjectFileDTO createProjectTestrunFile(long projectId, long testrunId, String name, Long size, String type, MultipartFile multipartFile) {
        ProjectFileDTO file = createFile(projectId, name, size, type, multipartFile);
        file.setFileSourceType(FileSourceTypeCode.TESTRUN);
        file.setFileSourceId(testrunId);
        return new ProjectFileDTO(projectFileRepository.save(file.toEntity()));
    }

    public ProjectFileDTO createProjectTestcaseFile(long projectId, long testcaseId, String name, Long size, String type, MultipartFile multipartFile) {
        ProjectFileDTO file = createFile(projectId, name, size, type, multipartFile);
        file.setFileSourceType(FileSourceTypeCode.TESTCASE);
        file.setFileSourceId(testcaseId);
        return new ProjectFileDTO(projectFileRepository.save(file.toEntity()));
    }

    public ProjectFileDTO selectProjectFile(Long projectId, Long imageId, String uuid) {
        ProjectFile projectFile = projectFileRepository.findByIdAndProjectIdAndUuid(imageId, projectId, uuid).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new ProjectFileDTO(projectFile);
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


}
