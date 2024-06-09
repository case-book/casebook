package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.biz.space.entity.SpaceMessageChannel;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "project_message_channel")
public class ProjectMessageChannel extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_PROJECT_MESSAGE_CHANNEL__PROJECT"))
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_message_channel_id", foreignKey = @ForeignKey(name = "FK_PROJECT_MESSAGE_CHANNEL__SPACE_MESSAGE_CHANNEL"))
    private SpaceMessageChannel messageChannel;


}
