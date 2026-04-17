package com.example.fashionshop.modules.dashboard.controller;

import com.example.fashionshop.common.response.ApiResponse;
import com.example.fashionshop.modules.dashboard.dto.HomeResponseDto;
import com.example.fashionshop.modules.dashboard.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/home")
@RequiredArgsConstructor
public class HomeController {

    private final HomeService homeService;

    @GetMapping
    public ApiResponse<HomeResponseDto> getHome() {
        return ApiResponse.success("Homepage loaded successfully", homeService.getHomeData());
    }
}
