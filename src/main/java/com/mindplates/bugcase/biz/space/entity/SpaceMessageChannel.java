package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.common.code.MessageChannelTypeCode;
import com.mindplates.bugcase.common.code.PayloadTypeCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import javax.persistence.CascadeType;
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
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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
    @Enumerated(EnumType.STRING)
    private HttpMethod httpMethod;

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

    @OneToMany(mappedBy = "spaceMessageChannel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SpaceMessageChannelHeader> headers;

    @OneToMany(mappedBy = "spaceMessageChannel", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SpaceMessageChannelPayload> payloads;


}
