package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemCategory;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import com.mindplates.bugcase.framework.converter.StringListConverter;
import java.util.List;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
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
