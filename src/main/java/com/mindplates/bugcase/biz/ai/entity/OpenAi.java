package com.mindplates.bugcase.biz.ai.entity;


import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Builder
@Table(name = "open_ai")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OpenAi extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name; // openai

    @Column(name = "url", length = ColumnsDef.NAME)
    private String url; // https://api.openai.com/v1

    @Column(name = "api_key", length = ColumnsDef.NAME)
    private String apiKey; // sk-kdkdkdk

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "openAi", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SELECT)
    private List<OpenAiModel> models;

    @OneToOne
    private Llm llm;

}
