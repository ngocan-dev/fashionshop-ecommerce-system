package com.example.fashionshop.modules.dashboard.repository;

import com.example.fashionshop.modules.dashboard.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Integer> {
    List<Banner> findByIsActiveTrueOrderByDisplayOrderAsc();
    List<Banner> findTop5ByIsActiveTrueOrderByDisplayOrderAsc();
}