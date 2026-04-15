package com.smarthire.service;

import com.smarthire.dto.ApplicationDto;
import com.smarthire.model.Application;
import com.smarthire.model.ApplicationStatus;
import com.smarthire.model.Job;
import com.smarthire.model.User;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public ApplicationDto submitApplication(Long userId, Long jobId, String resumeFileName) {
        User user = userRepository.findById(userId).orElseThrow();
        Job job = jobRepository.findById(jobId).orElseThrow();

        Application app = Application.builder()
                .user(user)
                .job(job)
                .resumeUrl("/uploads/" + resumeFileName)
                .status(ApplicationStatus.APPLIED)
                .build();

        app = applicationRepository.save(app);
        return mapToDto(app);
    }

    public List<ApplicationDto> getApplicationsByUser(Long userId) {
        return applicationRepository.findByUserId(userId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<ApplicationDto> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private ApplicationDto mapToDto(Application app) {
        return ApplicationDto.builder()
                .id(app.getId())
                .userId(app.getUser().getId())
                .userName(app.getUser().getName())
                .jobId(app.getJob().getId())
                .jobTitle(app.getJob().getTitle())
                .resumeUrl(app.getResumeUrl())
                .status(app.getStatus())
                .appliedAt(app.getAppliedAt())
                .build();
    }
}
