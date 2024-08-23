package com.mindplates.bugcase.biz.ai.entity;


import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
