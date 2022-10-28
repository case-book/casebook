package com.mindplates.bugcase.biz.space.entity;

import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Index;
import javax.persistence.NamedAttributeNode;
import javax.persistence.NamedEntityGraph;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.springframework.data.jpa.repository.EntityGraph;

@Entity
@Builder
@Table(name = "space", indexes = {
    @Index(name = "IDX_SPACE_CODE", columnList = "code", unique = true),
    @Index(name = "IDX_SPACE_CODE_AND_ACTIVATED", columnList = "code, activated")
})
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter

public class Space extends CommonEntity {

  @Id
  @Column(name = "id")
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Long id;

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

  public void merge(Space space) {
    this.name = space.getName();
    this.code = space.getCode();
    this.description = space.getDescription();
    this.activated = space.isActivated();
    this.token = space.getToken();
  }

}
