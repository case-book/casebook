package com.mindplates.bugcase.biz.sequence.entity;

import com.mindplates.bugcase.biz.testcase.entity.Testcase;
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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Builder
@Table(name = "sequence_node")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SequenceNode extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testcase_id", foreignKey = @ForeignKey(name = "FK_SEQUENCE__TESTCASE"))
    private Testcase testcase;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sequence_id", foreignKey = @ForeignKey(name = "FK_SEQUENCE_NODE__SEQUENCE"))
    private Sequence sequence;

    @Column(name = "type", length = ColumnsDef.CODE)
    private String type;

    @Column(name = "style", columnDefinition = ColumnsDef.LONGTEXT)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> style;

    @Column(name = "position", columnDefinition = ColumnsDef.LONGTEXT)
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, String> position;


}
