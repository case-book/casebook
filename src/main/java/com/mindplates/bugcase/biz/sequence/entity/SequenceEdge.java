package com.mindplates.bugcase.biz.sequence.entity;

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
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Builder
@Table(name = "sequence_edge")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SequenceEdge extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "edge_id", length = ColumnsDef.CODE)
    private String edgeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sequence_id", foreignKey = @ForeignKey(name = "FK_SEQUENCE_EDGE__SEQUENCE"))
    private Sequence sequence;

    @Column(name = "source_node_id", length = ColumnsDef.CODE)
    private String sourceNodeId;

    @Column(name = "target_node_id", length = ColumnsDef.CODE)
    private String targetNodeId;

    @Column(name = "type", length = ColumnsDef.CODE)
    private String type;

    @Column(name = "style", columnDefinition = ColumnsDef.LONGTEXT)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> style;

    @ManyToOne(fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.JOIN)
    @JoinColumn(name = "source_id", foreignKey = @ForeignKey(name = "FK_SEQUENCE_EDGE__SEQUENCE_SOURCE_NODE"))
    private SequenceNode source;

    @ManyToOne(fetch = FetchType.EAGER)
    @Fetch(value = FetchMode.JOIN)
    @JoinColumn(name = "target_id", foreignKey = @ForeignKey(name = "FK_SEQUENCE_EDGE__SEQUENCE_TARGET_NODE"))
    private SequenceNode target;


}
