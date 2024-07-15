package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
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

@Entity
@Builder
@Table(name = "project_file")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProjectFile extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_PROJECT_FILE__PROJECT"))
    private Project project;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "type", nullable = false, length = ColumnsDef.CODE)
    private String type;

    @Column(name = "path", nullable = false, length = ColumnsDef.PATH)
    private String path;

    @Column(name = "size", nullable = false)
    private Long size;

    @Column(name = "uuid", nullable = false, length = ColumnsDef.CODE)
    private String uuid;

    @Column(name = "file_source_type", length = ColumnsDef.CODE)
    private FileSourceTypeCode fileSourceType;

    @Column(name = "file_source_id")
    private Long fileSourceId;


}
