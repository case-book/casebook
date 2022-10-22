package com.mindplates.bugcase.biz.user.service;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.biz.user.repository.UserRepository;
import com.mindplates.bugcase.common.entity.SystemRole;
import com.mindplates.bugcase.common.util.EncryptUtil;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
public class UserService {

  private final UserRepository userRepository;


  private final EncryptUtil encryptUtil;


  public List<User> selectUserList() {
    return userRepository.findAll();
  }


  public User selectUserInfo(Long id) {
    return userRepository.findById(id).orElse(null);
  }


  public boolean existUserByEmail(String email, Long exceptUserId) {
    if (exceptUserId != null) {
      return userRepository.countByEmailAndIdNot(email, exceptUserId) > 0L;
    }
    return userRepository.countByEmail(email) > 0L;
  }


  public User selectUserByUuid(String uuid) {
    return userRepository.findByUuid(uuid).orElse(null);
  }

  @Transactional
  public User createUser(User user) {
    LocalDateTime now = LocalDateTime.now();

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
    return userRepository.save(user);
  }


  @Transactional
  public void deleteUser(Long id) {
    userRepository.deleteById(id);
  }

  public User login(String email, String password) throws NoSuchAlgorithmException {
    return userRepository.findByEmail(email).filter(user -> {
      String salt = user.getSalt();
      byte[] saltBytes = new java.math.BigInteger(salt, 16).toByteArray();
      String encryptedText = encryptUtil.getEncrypt(password, saltBytes);

      return user.getPassword().equals(encryptedText);
    }).orElse(null);
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

}
