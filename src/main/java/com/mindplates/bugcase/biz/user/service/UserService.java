package com.mindplates.bugcase.biz.user.service;

import com.mindplates.bugcase.biz.ai.repository.AiRequestHistoryRepository;
import com.mindplates.bugcase.biz.project.service.ProjectService;
import com.mindplates.bugcase.biz.space.service.SpaceService;
import com.mindplates.bugcase.biz.testrun.service.TestrunService;
import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.biz.user.repository.UserTokenRepository;
import com.mindplates.bugcase.common.code.SystemRole;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.EncryptUtil;
import com.mindplates.bugcase.framework.config.CacheConfig;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final EncryptUtil encryptUtil;
    private final AiRequestHistoryRepository aiRequestHistoryRepository;
    private final UserTokenRepository userTokenRepository;
    private final UserCachedService userCachedService;
    private final TestrunService testrunService;
    private final SpaceService spaceService;
    private final ProjectService projectService;

    public UserService(
        UserRepository userRepository,
        EncryptUtil encryptUtil,
        AiRequestHistoryRepository aiRequestHistoryRepository,
        UserTokenRepository userTokenRepository,
        UserCachedService userCachedService,
        @Lazy TestrunService testrunService,
        @Lazy SpaceService spaceService,
        @Lazy ProjectService projectService) {
        this.userRepository = userRepository;
        this.encryptUtil = encryptUtil;
        this.aiRequestHistoryRepository = aiRequestHistoryRepository;
        this.userTokenRepository = userTokenRepository;
        this.userCachedService = userCachedService;
        this.testrunService = testrunService;
        this.spaceService = spaceService;
        this.projectService = projectService;
    }

    public UserDTO getUserInfo(Long userId) {
        return userCachedService.getUserInfo(userId);
    }


    public UserDTO selectUserInfo(Long userId) {
        try {
            return userCachedService.getUserInfo(userId);
        } catch (ServiceException e) {
            return null;
        }
    }


    public boolean existUserByEmail(String email, Long exceptUserId) {
        if (exceptUserId != null) {
            return userRepository.countByEmailAndIdNot(email, exceptUserId) > 0L;
        }
        return userRepository.countByEmail(email) > 0L;
    }

    private void checkUserValidation(UserDTO user) {
        boolean existEmailUser = existUserByEmail(user.getEmail(), null);
        if (existEmailUser) {
            throw new ServiceException("error.exist.email");
        }
    }

    @Transactional
    public UserDTO createUser(UserDTO user, SystemRole role) {
        checkUserValidation(user);

        String plainText = user.getPassword();
        byte[] saltBytes = encryptUtil.getSaltByteArray();
        String salt = encryptUtil.getSaltString(saltBytes);
        user.setSalt(salt);
        String encryptedText = encryptUtil.getEncrypt(plainText, saltBytes);
        user.setPassword(encryptedText);
        if (role == null) {
            user.setSystemRole(SystemRole.ROLE_USER);
            user.setActiveSystemRole(SystemRole.ROLE_USER);
        } else {
            user.setSystemRole(role);
            user.setActiveSystemRole(role);
        }

        user.setActivateYn(true);
        user.setActivateMailSendResult(false);
        user.setRecoveryToken("");
        user.setRecoveryMailSendResult(false);
        user.setUseYn(true);
        User result = userRepository.save(user.toEntity());
        return new UserDTO(result);
    }


    @CacheEvict(key = "{#userId}", value = CacheConfig.USER)
    @Transactional
    public void updateUser(Long userId, UserDTO user) {
        User targetUser = userRepository.findById(userId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        targetUser.update(user, false);
        userRepository.save(targetUser);
    }

    @CacheEvict(key = "{#userId}", value = CacheConfig.USER)
    @Transactional
    public void updateUserByAdmin(Long userId, UserDTO user) {
        User targetUser = userRepository.findById(userId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        targetUser.update(user, true);
        userRepository.save(targetUser);
    }

    @CacheEvict(key = "{#userId}", value = CacheConfig.USER)
    @Transactional
    public void deleteUserByAdmin(Long userId) {
        User targetUser = userRepository.findById(userId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        spaceService.deleteSpaceUser(userId);
        testrunService.deleteTestrunByUserId(userId);
        projectService.deleteProjectUser(userId);
        aiRequestHistoryRepository.updateTesterNullByUserId(userId);
        userTokenRepository.deleteByUserId(userId);
        userRepository.delete(targetUser);
    }

    @CacheEvict(key = "{#userId}", value = CacheConfig.USER)
    @Transactional
    public void updateUserPassword(Long userId, String currentPassword, String newPassword) {
        User userInfo = userRepository.findById(userId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));

        String currentSalt = userInfo.getSalt();
        byte[] currentSaltBytes = new java.math.BigInteger(currentSalt, 16).toByteArray();
        String currentEncryptedText = encryptUtil.getEncrypt(currentPassword, currentSaltBytes);

        if (!userInfo.getPassword().equals(currentEncryptedText)) {
            throw new ServiceException(HttpStatus.BAD_REQUEST, "user.current.password.not.matched");
        }

        encryptPassword(newPassword, userInfo);
        userRepository.save(userInfo);
    }


    @CacheEvict(key = "{#userId}", value = CacheConfig.USER)
    @Transactional
    public void updateUserPasswordByAdmin(Long userId, String newPassword) {
        User userInfo = userRepository.findById(userId).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        encryptPassword(newPassword, userInfo);
        userRepository.save(userInfo);
    }

    @CacheEvict(key = "{#userId}", value = CacheConfig.USER)
    @Transactional
    public void updateUserLastSeen(Long userId, LocalDateTime lastSeen) {
        userRepository.updateUserLastSeen(userId, lastSeen);
    }


    public UserDTO login(String email, String password) {
        User userInfo = userRepository.findByEmail(email).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        String salt = userInfo.getSalt();
        byte[] saltBytes = new java.math.BigInteger(salt, 16).toByteArray();
        String encryptedText = encryptUtil.getEncrypt(password, saltBytes);

        if (userInfo.getPassword().equals(encryptedText)) {
            return new UserDTO(userInfo);
        }

        return null;
    }

    public List<UserDTO> selectUserList() {
        List<User> users = userRepository.findAll();
        return users.stream().map(UserDTO::new).collect(Collectors.toList());
    }

    private void encryptPassword(String newPassword, User userInfo) {
        byte[] saltBytes = encryptUtil.getSaltByteArray();
        String salt = encryptUtil.getSaltString(saltBytes);
        userInfo.setSalt(salt);
        String encryptedText = encryptUtil.getEncrypt(newPassword, saltBytes);
        userInfo.setPassword(encryptedText);
    }

}
