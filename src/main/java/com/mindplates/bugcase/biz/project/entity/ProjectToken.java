package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
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
