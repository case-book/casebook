package com.mindplates.bugcase.biz.integration.dto;

import lombok.Data;

@Data
public class JiraAgileDTO<T> extends JiraAgileResponseDTO {

    private T values;

}
