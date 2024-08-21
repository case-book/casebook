package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.biz.ai.entity.Llm;
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
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

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

    @Column(name = "country", length = ColumnsDef.CODE)
    private String country;

    @Column(name = "time_zone", length = ColumnsDef.CODE)
    private String timeZone;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<SpaceUser> users;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    @Column(updatable = false, insertable = false)
    private List<SpaceApplicant> applicants;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    @Column(updatable = false, insertable = false)
    private List<SpaceMessageChannel> messageChannels;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<Holiday> holidays;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    @Column(updatable = false, insertable = false)
    private List<Llm> llms;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "space", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    @Column(updatable = false, insertable = false)
    private List<SpaceLlmPrompt> llmPrompts;

    @Transient
    private Long projectCount;

    @Transient
    private Long userCount;

    @Transient
    private boolean isMember;

    @Transient
    private boolean isAdmin;

    public Space(long id, String name, String code, boolean activated, boolean allowSearch, boolean allowAutoJoin, String description, long projectCount, long userCount, boolean isMember,
        boolean isAdmin) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.activated = activated;
        this.allowSearch = allowSearch;
        this.allowAutoJoin = allowAutoJoin;
        this.description = description;
        this.projectCount = projectCount;
        this.userCount = userCount;
        this.isMember = isMember;
        this.isAdmin = isAdmin;
    }

    public Space(long id, String name, String code, boolean activated, boolean allowSearch, boolean allowAutoJoin, String description, long projectCount, long userCount) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.activated = activated;
        this.allowSearch = allowSearch;
        this.allowAutoJoin = allowAutoJoin;
        this.description = description;
        this.projectCount = projectCount;
        this.userCount = userCount;
    }


}
