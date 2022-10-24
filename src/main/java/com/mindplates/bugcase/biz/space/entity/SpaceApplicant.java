package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.ApprovalStatusCode;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
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
@Table(name = "space_applicant")
public class SpaceApplicant extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_SPACE_APPLICANT__USER"))
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE_APPLICANT__SPACE"))
  private Space space;

  @Column(name = "approval_status_code", length = ColumnsDef.CODE)
  @Enumerated(EnumType.STRING)
  private ApprovalStatusCode approvalStatusCode;
}
