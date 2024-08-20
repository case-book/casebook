package com.mindplates.bugcase.biz.testrun.entity;

import com.mindplates.bugcase.common.code.TestrunHookTiming;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import com.mindplates.bugcase.common.util.HttpRequestUtil;
import com.mindplates.bugcase.common.vo.TestrunHookResult;
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
import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.http.HttpMethod;

@Entity
@Builder
@Table(name = "testrun_hook")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestrunHook extends CommonEntity implements Cloneable {

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


    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "headers", columnDefinition = ColumnsDef.LONGTEXT)
    private List<Map<String, String>> headers;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "bodies", columnDefinition = ColumnsDef.LONGTEXT)
    private List<Map<String, String>> bodies;

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

    public TestrunHookResult request(HttpRequestUtil httpRequestUtil) {
        TestrunHookResult testrunHookResult = httpRequestUtil.request(this.url, HttpMethod.valueOf(this.method), this.headers, this.bodies);
        this.result = Integer.toString(testrunHookResult.getCode().value());
        return testrunHookResult;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public TestrunHook cloneEntity() {
        try {
            TestrunHook copiedTestrunHook = (TestrunHook) this.clone();
            copiedTestrunHook.setId(null);
            return copiedTestrunHook;
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Clone not supported for Testrun", e);
        }
    }
}
