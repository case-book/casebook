package com.mindplates.bugcase.common.vo;

import com.mindplates.bugcase.biz.project.dto.ProjectDTO;
import com.mindplates.bugcase.biz.project.vo.request.ProjectUserRequest;
import com.mindplates.bugcase.biz.space.entity.SpaceApplicant;
import com.mindplates.bugcase.biz.testcase.vo.request.TestcaseTemplateRequest;
import lombok.Data;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


public interface IRequestVO<T> {
    T toDTO();
}
