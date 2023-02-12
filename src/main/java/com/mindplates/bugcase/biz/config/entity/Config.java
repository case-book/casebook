package com.mindplates.bugcase.biz.config.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

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

    @Column(name = "value", length = ColumnsDef.NAME)
    String value;
}
