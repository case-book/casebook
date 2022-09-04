package com.mindplates.bugcase.biz.testcase.entity;

import com.mindplates.bugcase.biz.common.constants.ColumnsDef;
import com.mindplates.bugcase.biz.common.entity.CommonEntity;
import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.testcase.constants.TestcaseItemType;
import com.mindplates.bugcase.framework.converter.StringListConverter;
import lombok.*;

import javax.persistence.*;
import java.util.List;


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
    Long id;

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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "testcase_template_id", foreignKey = @ForeignKey(name = "FK_TESTCASE_TEMPLATE_ITEM__TESTCASE_TEMPLATE"))
    private TestcaseTemplate testcaseTemplate;

}
