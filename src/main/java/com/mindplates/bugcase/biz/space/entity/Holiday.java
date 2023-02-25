package com.mindplates.bugcase.biz.space.entity;


import com.mindplates.bugcase.common.code.HolidayTypeCode;
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

    @Column(name = "holiday_type", length = ColumnsDef.CODE)
    private HolidayTypeCode holidayType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "space_id", foreignKey = @ForeignKey(name = "FK_SPACE__HOLIDAY"))
    private Space space;

    // YEARLY, SPECIFIED_DATE에서 사용
    @Column(name = "date", length = ColumnsDef.DATE_STRING)
    private String date;

    @Column(name = "month")
    private Integer month; // 매월 -1

    @Column(name = "week")
    private Integer week; // 마지막주 -1

    @Column(name = "day")
    private Integer day;

    @Column(name = "name", length = ColumnsDef.NAME)
    private String name;

    // 아래는 삭제
    @Column(name = "is_regular")
    private Boolean isRegular;

}
