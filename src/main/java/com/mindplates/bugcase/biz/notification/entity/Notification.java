package com.mindplates.bugcase.biz.notification.entity;

import com.mindplates.bugcase.common.code.NotificationTargetCode;
import com.mindplates.bugcase.common.constraints.ColumnsDef;
import com.mindplates.bugcase.common.entity.CommonEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Table(name = "notification", indexes = {
        @Index(name = "IDX_NOTIFICATION_USER_ID", columnList = "user_id"),
        @Index(name = "IDX_NOTIFICATION_USER_ID_AND_CREATION_DATE", columnList = "user_id, creation_date"),
        @Index(name = "IDX_NOTIFICATION_TARGET_AND_TARGET_ID", columnList = "target, target_id")
})
public class Notification extends CommonEntity {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "target", nullable = false, length = ColumnsDef.CODE)
    private NotificationTargetCode target;

    @Column(name = "target_id", nullable = false)
    private Long targetId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "message", length = ColumnsDef.TEXT)
    private String message;

    @Column(name = "url", length = ColumnsDef.URL)
    private String url;


}
