package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import com.mindplates.bugcase.framework.converter.StringListConverter;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Builder
@Table(name = "testcase_template_item")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TestcaseTemplateItem extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "category", nullable = false, length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private TestcaseItemCategory category;

    @Column(name = "type", nullable = false, length = ColumnsDef.CODE)
    @Enumerated(EnumType.STRING)
    private TestcaseItemType type;

    @Column(name = "item_order")
    private Integer itemOrder;

    @Column(name = "label", nullable = false, length = ColumnsDef.NAME)
    private String label;

    @Column(name = "options", length = ColumnsDef.TEXT)
    @Convert(converter = StringListConverter.class)
    private List<String> options;

    @Column(name = "size")
    private Integer size;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testcase_template_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_TEMPLATE_ITEM__TESTCASE_TEMPLATE"))
    private TestcaseTemplate testcaseTemplate;

    @Column(name = "default_type")
    private String defaultType;

    @Column(name = "default_value")
    private String defaultValue;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @Column(name = "example", length = ColumnsDef.TEXT)
    private String example;

    @Column(name = "editable")
    private Boolean editable;

    @Column(name = "system_label", length = ColumnsDef.CODE)
    private String systemLabel;

    @Transient
    private boolean deleted;

}
