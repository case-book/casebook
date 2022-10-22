package com.mindplates.bugcase.biz.user.vo.request;


import com.mindplates.bugcase.biz.user.entity.User;
import javax.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class JoinRequest {

  private Long id;
  @NotBlank
  private String email;
  @NotBlank
  private String name;
  private String phone;
  private String country;
  private String language;
  @NotBlank
  private String password;


  public User buildEntity() {
    return User.builder()
        .id(id)
        .email(email)
        .name(name)
        .country(country)
        .language(language)
        .password(password)
        .build();
  }
}
