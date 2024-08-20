package com.mindplates.bugcase.biz.space.entity;

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
@Table(name = "space_profile_variable")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SpaceProfileVariable extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "value", nullable = false, length = ColumnsDef.TEXT)
    private String value;

    @ManyToOne
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE_PROFILE_VARIABLE__SPACE"))
    private Space space;

    @ManyToOne
    @JoinColumn(name = "space_variable_id", foreignKey = @ForeignKey(name = "FK_SPACE_PROFILE_VARIABLE__SPACE_VARIABLE"))
    private SpaceVariable spaceVariable;

    @ManyToOne
    @JoinColumn(name = "space_profile_id", foreignKey = @ForeignKey(name = "FK_SPACE_PROFILE_VARIABLE__SPACE_PROFILE"))
    private SpaceProfile spaceProfile;

}
