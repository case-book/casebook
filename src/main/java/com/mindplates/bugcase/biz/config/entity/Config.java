package com.mindplates.bugcase.biz.config.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "config")
public class Config extends CommonEntity {

    @Id
    @Column(name = "code", nullable = false, unique = true, length = ColumnsDef.CODE, updatable = false)
    String code;

    @Column(name = "value", length = ColumnsDef.TEXT)
    String value;
}
