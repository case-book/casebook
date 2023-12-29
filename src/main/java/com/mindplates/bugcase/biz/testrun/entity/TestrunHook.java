package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import io.hypersistence.utils.hibernate.type.json.JsonType;
import java.util.List;
import java.util.Map;
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
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

@Entity
@Builder
@Table(name = "testrun_hook")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@TypeDef(name = "json", typeClass = JsonType.class)
public class TestrunHook extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "timing", length = ColumnsDef.CODE)
    private TestrunHookTiming timing;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "url", nullable = false, length = ColumnsDef.URL)
    private String url;

    @Column(name = "method", nullable = false, length = ColumnsDef.CODE)
    private String method;

    @Type(type = "json")
    @Column(name = "headers", columnDefinition = ColumnsDef.LONGTEXT)
    private List<Map<String, Object>> headers;

    @Type(type = "json")
    @Column(name = "bodies", columnDefinition = ColumnsDef.LONGTEXT)
    private List<Map<String, Object>> bodies;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_HOOK__TESTRUN"))
    private Testrun testrun;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_reservation_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_HOOK__TESTRUN_RESERVATION"))
    private TestrunReservation testrunReservation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "testrun_iteration_id", foreignKey = @ForeignKey(name = "FK_TESTRUN_HOOK__TESTRUN_ITERATION"))
    private TestrunIteration testrunIteration;

    @Column(name = "retry_count")
    private Integer retryCount;

    @Column(name = "result", length = ColumnsDef.CODE)
    private String result;

    @Column(name = "message", columnDefinition = ColumnsDef.LONGTEXT)
    private String message;
}
