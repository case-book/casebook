package com.mindplates.bugcase.biz.user.service;

import com.mindplates.bugcase.biz.user.dto.UserDTO;
import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.common.code.SystemRole;
import com.mindplates.bugcase.common.exception.ServiceException;
import com.mindplates.bugcase.common.util.EncryptUtil;
import com.mindplates.bugcase.common.util.MappingUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EncryptUtil encryptUtil;
    private final MappingUtil mappingUtil;



    public UserDTO selectUserInfo(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ServiceException(HttpStatus.NOT_FOUND));
        return new UserDTO(user);
    }


    public boolean existUserByEmail(String email, Long exceptUserId) {
        if (exceptUserId != null) {
            return userRepository.countByEmailAndIdNot(email, exceptUserId) > 0L;
        }
        return userRepository.countByEmail(email) > 0L;
    }


    @Transactional
    public UserDTO createUser(User user) {
        String plainText = user.getPassword();
        byte[] saltBytes = encryptUtil.getSaltByteArray();
        String salt = encryptUtil.getSaltString(saltBytes);
        user.setSalt(salt);
        String encryptedText = encryptUtil.getEncrypt(plainText, saltBytes);
        user.setPassword(encryptedText);
        user.setSystemRole(SystemRole.ROLE_USER);
        user.setActiveSystemRole(SystemRole.ROLE_USER);
        user.setActivateYn(true);
        user.setActivateMailSendResult(false);
        user.setRecoveryToken("");
        user.setRecoveryMailSendResult(false);
        user.setUseYn(true);
        return new UserDTO(userRepository.save(user));
    }

    @Transactional
    public UserDTO updateUser(UserDTO user) {
        return new UserDTO(userRepository.save(mappingUtil.convert(user, User.class)));
    }

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

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean auth(Long userId, String password) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return false;
        }

        String salt = user.getSalt();
        byte[] saltBytes = new java.math.BigInteger(salt, 16).toByteArray();
        String encryptedText = encryptUtil.getEncrypt(password, saltBytes);

        return user.getPassword().equals(encryptedText);
    }

    public User selectUserByUuid(String uuid) {
        return userRepository.findByUuid(uuid).orElse(null);
    }

    public List<User> selectUserList() {
        return userRepository.findAll();
    }

}
