package com.mindplates.bugcase.common.util;

import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.framework.config.FileConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;

@Component
@Slf4j
public class FileUtil {
    private final Path fileStorageLocation;


    public FileUtil(FileConfig fileConfig) {
        this.fileStorageLocation = Paths.get(fileConfig.getUploadDir()).toAbsolutePath().normalize();


        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new ServiceException("image.upload.failed");
        }
    }

    public String storeFile(Long projectId, MultipartFile file) {

        Path projectUploadDir = this.fileStorageLocation.resolve(Long.toString(projectId));
        if (!Files.exists(projectUploadDir)) {
            try {
                Files.createDirectories(projectUploadDir.normalize());
            } catch (Exception ex) {
                throw new ServiceException("image.upload.failed");
            }
        }

        Path path = projectUploadDir.resolve(file.getOriginalFilename());
        while (Files.exists(path)) {
            Timestamp timestamp = new Timestamp(System.currentTimeMillis());
            path = projectUploadDir.resolve(File.separator + file.getOriginalFilename() + "." + timestamp.getTime());
        }

        Path targetLocation = null;
        String savePath = StringUtils.cleanPath(path.getFileName().toString());

        try {
            targetLocation = projectUploadDir.resolve(savePath);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return projectId + File.separator + savePath;
        } catch (Exception ex) {
            try {
                if (targetLocation != null) {
                    Files.deleteIfExists(targetLocation);
                }
            } catch (IOException e) {
                log.error("File delete error", e);

            }
            throw new ServiceException("image.upload.failed");
        }

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

    public Resource loadFileIfExist(String path) {
        try {
            Path filePath = this.fileStorageLocation.resolve(path).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists()) {
                return resource;
            } else {
                return null;
            }
        } catch (MalformedURLException ex) {
            return null;
        }
    }

}

