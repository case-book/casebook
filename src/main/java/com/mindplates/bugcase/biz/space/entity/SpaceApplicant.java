package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.code.ApprovalStatusCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
@Table(name = "space_applicant", indexes = {
    @Index(name = "IDX_SPACE_APPLICANT_SPACE_ID_AND_USER_ID", columnList = "space_id, user_id", unique = true)
})
public class SpaceApplicant extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_SPACE_APPLICANT__USER"))
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE_APPLICANT__SPACE"))
    private Space space;

    @Column(name = "approval_status_code", length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private ApprovalStatusCode approvalStatusCode;

    @Column(name = "message", length = ColumnsDef.TEXT)
    private String message;
}
