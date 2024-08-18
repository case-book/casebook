package com.mindplates.bugcase.biz.ai.entity;


import com.mindplates.bugcase.biz.user.entity.User;
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
import org.springframework.http.HttpStatus;

@Entity
@Builder
@Table(name = "ai_request_history")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AiRequestHistory extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "ai_model_id", foreignKey = @ForeignKey(name = "FK_AI_REQUEST_HISTORY__OPEN_AI_MODEL"))
    private OpenAiModel model;

    @Column(name = "http_status")
    private HttpStatus httpStatus;

    @Column(name = "request", columnDefinition = ColumnsDef.LONGTEXT)
    private String request;

    @Column(name = "response", columnDefinition = ColumnsDef.LONGTEXT)
    private String response;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", foreignKey = @ForeignKey(name = "FK_AI_REQUEST_HISTORY__USER"))
    private User requester;
}
