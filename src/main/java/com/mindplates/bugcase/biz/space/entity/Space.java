package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.*;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Entity
@Builder
@Table(name = "space", indexes = {@Index(name = "IDX_SPACE_CODE", columnList = "code", unique = true), @Index(name = "IDX_SPACE_CODE_AND_ACTIVATED", columnList = "code, activated")})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Space extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "code", nullable = false, length = ColumnsDef.CODE)
    private String code;

    @Column(name = "description", length = ColumnsDef.TEXT)
    private String description;

    @Column(name = "activated")
    private boolean activated;

    @Column(name = "allow_search")
    private boolean allowSearch;

    @Column(name = "allow_auto_join")
    private boolean allowAutoJoin;

    @Column(name = "token", length = ColumnsDef.CODE)
    private String token;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<SpaceUser> users;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    @Column(updatable = false, insertable = false)
    private List<SpaceApplicant> applicants;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Holiday> holidays;

    @Column(name = "country", length = ColumnsDef.CODE)
    private String country;

    @Column(name = "time_zone", length = ColumnsDef.CODE)
    private String timeZone;


}
