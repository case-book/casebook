package com.mindplates.bugcase.biz.space.entity;


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
@Table(name = "space_llm_prompt")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpaceLlmPrompt extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

    @Column(name = "system_role", length = ColumnsDef.TEXT)
    private String systemRole;

    @Column(name = "prompt", length = ColumnsDef.TEXT)
    private String prompt;

    @Column(name = "activated")
    private boolean activated;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE_LLM_PROMPT__SPACE"))
    private Space space;

}
