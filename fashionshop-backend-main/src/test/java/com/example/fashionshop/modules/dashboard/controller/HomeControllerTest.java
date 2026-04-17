package com.example.fashionshop.modules.dashboard.controller;

import com.example.fashionshop.common.exception.HomeDataLoadException;
import com.example.fashionshop.modules.dashboard.dto.HomeBannerDto;
import com.example.fashionshop.modules.dashboard.dto.HomeCategoryDto;
import com.example.fashionshop.modules.dashboard.dto.HomeProductDto;
import com.example.fashionshop.modules.dashboard.dto.HomeResponseDto;
import com.example.fashionshop.modules.dashboard.service.HomeService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(HomeController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({com.example.fashionshop.common.exception.GlobalExceptionHandler.class, com.example.fashionshop.config.TestSecurityConfig.class})
class HomeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HomeService homeService;

    @Test
    void getHome_shouldReturnHomepageInformationForVisitors() throws Exception {
        HomeResponseDto homeResponse = HomeResponseDto.builder()
                .featuredProducts(List.of(
                        HomeProductDto.builder()
                                .id(1)
                                .name("Featured Jacket")
                                .description("Top-selling jacket")
                                .price(new BigDecimal("89.99"))
                                .imageUrl("https://cdn.example.com/p1.jpg")
                                .categoryName("Outerwear")
                                .build()))
                .categories(List.of(
                        HomeCategoryDto.builder()
                                .id(10)
                                .name("Outerwear")
                                .description("Jackets and coats")
                                .imageUrl("https://cdn.example.com/c1.jpg")
                                .build()))
                .banners(List.of(
                        HomeBannerDto.builder()
                                .id(100)
                                .title("Spring Sale")
                                .imageUrl("https://cdn.example.com/b1.jpg")
                                .linkUrl("/sale")
                                .build()))
                .build();

        when(homeService.getHomeData()).thenReturn(homeResponse);

        mockMvc.perform(get("/api/home").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Homepage loaded successfully"))
                .andExpect(jsonPath("$.data.featuredProducts[0].name").value("Featured Jacket"))
                .andExpect(jsonPath("$.data.categories[0].name").value("Outerwear"))
                .andExpect(jsonPath("$.data.banners[0].title").value("Spring Sale"));
    }

    @Test
    void getHome_shouldReturnUnableToLoadHomepageWhenDataRetrievalFails() throws Exception {
        when(homeService.getHomeData()).thenThrow(new HomeDataLoadException());

        mockMvc.perform(get("/api/home").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Unable to load homepage"));
    }
}
