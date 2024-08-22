package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.biz.user.entity.User;
import com.mindplates.bugcase.common.entity.CommonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
@Table(name = "testrun_comment")
public class TestrunComment extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_COMMENT__TESTRUN"))
    private Testrun testrun;

    @ManyToOne
    @JoinColumn(name = "user_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_COMMENT__USER"))
    private User user;

    @Column(columnDefinition = "text", name = "comment")
    private String comment;


}
