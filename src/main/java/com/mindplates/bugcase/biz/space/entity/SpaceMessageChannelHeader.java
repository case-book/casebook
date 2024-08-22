package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
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
@Table(name = "space_message_channel_header")
public class SpaceMessageChannelHeader extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_message_channel_id", foreignKey = @ForeignKey(name = "FK_SMCH__SMC"))
    private SpaceMessageChannel spaceMessageChannel;

    @Column(name = "data_key", length = ColumnsDef.TOKEN)
    private String dataKey;

    @Column(name = "data_value", length = ColumnsDef.TOKEN)
    private String dataValue;
}
