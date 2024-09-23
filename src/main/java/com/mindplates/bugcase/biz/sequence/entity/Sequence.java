package com.mindplates.bugcase.biz.sequence.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.biz.sequence.dto.SequenceDTO;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Builder
@Table(name = "sequence")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sequence extends CommonEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_SEQUENCE__PROJECT"))
    private Project project;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "sequence", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<SequenceNode> nodes;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "sequence", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<SequenceEdge> edges;


    public void updateInfo(SequenceDTO updateSequenceInfo) {
        this.name = updateSequenceInfo.getName();
        this.description = updateSequenceInfo.getDescription();

        // this.nodes에 있는데, updateSequenceInfo.getNodes()에는 없는 node는 삭제
        this.nodes.removeIf(node -> updateSequenceInfo.getNodes().stream().noneMatch(updateNode -> node.getId().equals(updateNode.getId())));
        // updateSequenceInfo.getNodes()에 id가 없는 노드를 추가
        updateSequenceInfo.getNodes().stream().filter(updateNode -> updateNode.getId() == null).forEach(updateNode -> {
            SequenceNode node = updateNode.toEntity();
            node.setSequence(this);
            this.nodes.add(node);
        });
        // updateSequenceInfo.getNodes()에 id가 있는 노드를 수정
        updateSequenceInfo.getNodes().stream().filter(updateNode -> updateNode.getId() != null).forEach(updateNode -> {
            SequenceNode node = this.nodes.stream().filter(n -> n.getId().equals(updateNode.getId())).findFirst().orElse(null);
            if (node != null) {
                node.updateInfo(updateNode);
            }
        });

        // this.edges에는 있는데, updateSequenceInfo.getEdges()에는 없는 edge는 삭제
        this.edges.removeIf(edge -> updateSequenceInfo.getEdges().stream().noneMatch(updateEdge -> edge.getId().equals(updateEdge.getId())));
        // updateSequenceInfo.getEdges()에 id가 없는 노드를 추가
        updateSequenceInfo.getEdges().stream().filter(updateEdge -> updateEdge.getId() == null).forEach(updateEdge -> {
            SequenceEdge edge = updateEdge.toEntity(this, this.nodes);
            edge.setSequence(this);
            this.edges.add(edge);
        });
        // updateSequenceInfo.getEdges()에 id가 있는 노드를 수정
        updateSequenceInfo.getEdges().stream().filter(updateEdge -> updateEdge.getId() != null).forEach(updateEdge -> {
            SequenceEdge edge = this.edges.stream().filter(e -> e.getId().equals(updateEdge.getId())).findFirst().orElse(null);
            if (edge != null) {
                edge.updateInfo(updateEdge, this.nodes);
            }
        });


    }
}
