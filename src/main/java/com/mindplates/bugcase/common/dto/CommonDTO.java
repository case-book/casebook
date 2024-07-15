package com.mindplates.bugcase.common.dto;

import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.Data;


@Data
public class CommonDTO implements Serializable {

    protected LocalDateTime creationDate;

    protected Long createdBy;

    protected LocalDateTime lastUpdateDate;

    protected Long lastUpdatedBy;


}
