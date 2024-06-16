package com.mindplates.bugcase.biz.ai.entity;


import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
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
@Table(name = "open_ai_model")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OpenAiModel extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name; // gpt-3.5-turbo

    @Column(name = "code", length = ColumnsDef.CODE)
    private String code; // gpt-3.5-turbo

    @ManyToOne
    @JoinColumn(name = "open_ai_id", foreignKey = @ForeignKey(name = "FK_OPEN_AI_MODEL__OPEN_AI"))
    private OpenAi openAi;

}
