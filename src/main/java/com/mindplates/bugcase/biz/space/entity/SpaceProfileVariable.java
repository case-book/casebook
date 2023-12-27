package com.mindplates.bugcase.biz.space.entity;

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
