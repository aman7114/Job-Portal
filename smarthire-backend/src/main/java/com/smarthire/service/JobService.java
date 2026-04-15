package com.smarthire.service;

import com.smarthire.dto.JobDto;
import com.smarthire.model.Job;
import com.smarthire.model.User;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public JobDto createJob(JobDto jobDto, Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Job job = Job.builder()
                .title(jobDto.getTitle())
                .description(jobDto.getDescription())
                .company(jobDto.getCompany())
                .location(jobDto.getLocation())
                .salary(jobDto.getSalary())
                .createdBy(user)
                .build();

        Job savedJob = jobRepository.save(job);
        return mapToDto(savedJob);
    }

    public List<JobDto> getAllJobs(String search) {
        List<Job> jobs;
        if (search != null && !search.trim().isEmpty()) {
            jobs = jobRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCaseOrCompanyContainingIgnoreCase(search, search, search);
        } else {
            jobs = jobRepository.findAll();
        }
        return jobs.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public JobDto getJobById(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new RuntimeException("Job not found"));
        return mapToDto(job);
    }

    public void deleteJob(Long id) {
        jobRepository.deleteById(id);
    }

    private JobDto mapToDto(Job job) {
        return JobDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .company(job.getCompany())
                .location(job.getLocation())
                .salary(job.getSalary())
                .createdBy(job.getCreatedBy().getName())
                .createdAt(job.getCreatedAt())
                .build();
    }
}
