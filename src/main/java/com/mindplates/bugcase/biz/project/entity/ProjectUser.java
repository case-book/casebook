package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.CommonEntity;
import com.mindplates.bugcase.common.entity.UserRole;

import javax.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "project_user")
public class ProjectUser extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @Column(name = "role")
  @Enumerated(EnumType.STRING)
  private UserRole role;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_USER__PROJECT"))
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_PROJECT__USER"))
  private Project project;

  @Transient
  private String crud;
}
