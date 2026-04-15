package com.smarthire.controller;

import com.smarthire.dto.ApplicationDto;
import com.smarthire.model.User;
import com.smarthire.service.ApplicationService;
import com.smarthire.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<ApplicationDto> applyForJob(
            @RequestParam("jobId") Long jobId,
            @RequestParam("resume") MultipartFile resumeFile,
            @AuthenticationPrincipal User user) {
        
        String fileName = fileStorageService.storeFile(resumeFile);
        return ResponseEntity.ok(applicationService.submitApplication(user.getId(), jobId, fileName));
    }

    @GetMapping("/user")
    public ResponseEntity<List<ApplicationDto>> getUserApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(applicationService.getApplicationsByUser(user.getId()));
    }

    @GetMapping("/job/{id}")
    public ResponseEntity<List<ApplicationDto>> getJobApplications(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(id));
    }
}
