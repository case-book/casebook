package com.mindplates.bugcase.biz.space.entity;


import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;

import javax.persistence.*;

@Entity
@Builder
@Table(name = "holiday")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Holiday extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE__HOLIDAY"))
    private Space space;

    @Column(name = "is_regular")
    private Boolean isRegular;

    @Column(name = "date", length = ColumnsDef.DATE_STRING)
    private String date;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

}
