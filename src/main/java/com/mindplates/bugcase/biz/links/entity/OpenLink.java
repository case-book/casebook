package com.mindplates.bugcase.biz.links.entity;

import com.mindplates.bugcase.biz.project.entity.Project;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.time.LocalDateTime;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Builder
@Table(name = "open_link")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OpenLink extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = ColumnsDef.NAME)
    private String name;

    @Column(name = "token", length = ColumnsDef.TOKEN)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", foreignKey = @ForeignKey(name = "FK_OPEN_LINK_TESTRUN__PROJECT"))
    private Project project;

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "openLink", cascade = CascadeType.ALL, orphanRemoval = true)
    @Fetch(value = FetchMode.SUBSELECT)
    private List<OpenLinkTestrun> testruns;

    @Column(name = "open_end_date_time")
    private LocalDateTime openEndDateTime;

    @Column(name = "opened")
    private boolean opened;


}
