package com.mindplates.bugcase.biz.config.entity;


import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Builder
@Table(name = "llm_prompt")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class LlmPrompt extends CommonEntity {

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

}
