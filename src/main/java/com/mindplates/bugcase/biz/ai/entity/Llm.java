package com.mindplates.bugcase.biz.ai.entity;


import com.mindplates.bugcase.biz.space.entity.Space;
import com.mindplates.bugcase.common.code.LlmTypeCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Table(name = "llm")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Llm extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "llm_type_code", length = ColumnsDef.CODE)
    private LlmTypeCode llmTypeCode;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "open_ai_id", foreignKey = @ForeignKey(name = "FK_LLM__OPEN_AI"))
    private OpenAi openAi;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_OPEN_AI__SPACE"))
    private Space space;

    @Column(name = "activated")
    private boolean activated;

}
