package com.mindplates.bugcase.common.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;


@Data
public class CommonDTO implements Serializable {

    private LocalDateTime creationDate;

    private Long createdBy;

    private LocalDateTime lastUpdateDate;

    private Long lastUpdatedBy;


}
