package com.mindplates.bugcase.biz.project.entity;

import com.mindplates.bugcase.common.code.FileSourceTypeCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;

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

    @ManyToOne
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
