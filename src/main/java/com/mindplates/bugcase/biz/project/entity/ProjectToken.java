package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
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
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Entity
@Builder
@Table(name = "project_token")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ProjectToken extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_PROJECT_TOKEN__PROJECT"))
    private Project project;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

    @Column(name = "token", nullable = false, length = ColumnsDef.TOKEN)
    private String token;

    @Column(name = "enabled")
    private boolean enabled;

    @Column(name = "last_access")
    private LocalDateTime lastAccess;

}
