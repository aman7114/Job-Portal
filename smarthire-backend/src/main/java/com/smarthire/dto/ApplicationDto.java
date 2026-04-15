package com.smarthire.dto;

import com.smarthire.model.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long jobId;
    private String jobTitle;
    private String resumeUrl;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
