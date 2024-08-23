package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.http.HttpMethod;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "space_message_channel")
public class SpaceMessageChannel extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE_MESSAGE__SPACE"))
    private Space space;

    @Column(name = "method", length = ColumnsDef.CODE)
    private String httpMethod;

    @Column(name = "message_channel_type", length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private MessageChannelTypeCode messageChannelType;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

    @Column(name = "payload_type", length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private PayloadTypeCode payloadType;

    @Column(name = "url", length = ColumnsDef.URL)
    private String url;

    @Column(name = "json", length = ColumnsDef.TEXT)
    private String json;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "spaceMessageChannel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<SpaceMessageChannelHeader> headers;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "spaceMessageChannel", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<SpaceMessageChannelPayload> payloads;


}
