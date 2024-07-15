package com.mindplates.bugcase.biz.space.entity;


import com.mindplates.bugcase.common.code.HolidayTypeCode;
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

    @ManyToOne(fetch = FetchType.LAZY)
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
}
