package com.mindplates.bugcase.common.dto;

import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;


@Data
public class CommonDTO implements Serializable {

    protected LocalDateTime creationDate;

    protected Long createdBy;

    protected LocalDateTime lastUpdateDate;

    protected Long lastUpdatedBy;


}
