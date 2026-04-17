package com.example.fashionshop.modules.dashboard.service;

import com.example.fashionshop.common.enums.OrderStatus;
import com.example.fashionshop.common.enums.Role;
import com.example.fashionshop.common.exception.BadRequestException;
import com.example.fashionshop.common.exception.DashboardLoadException;
import com.example.fashionshop.modules.dashboard.dto.ChartPointDto;
import com.example.fashionshop.modules.dashboard.dto.DashboardOrderStatsDto;
import com.example.fashionshop.modules.dashboard.dto.DashboardResponse;
import com.example.fashionshop.modules.dashboard.dto.DashboardRevenueStatsDto;
import com.example.fashionshop.modules.dashboard.dto.DashboardUserStatsDto;
import com.example.fashionshop.modules.dashboard.dto.RecentOrderDto;
import com.example.fashionshop.modules.dashboard.dto.RecentUserDto;
import com.example.fashionshop.modules.order.entity.Order;
import com.example.fashionshop.modules.order.repository.OrderRepository;
import com.example.fashionshop.modules.user.entity.User;
import com.example.fashionshop.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private static final int DEFAULT_DAYS = 30;

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(LocalDate from, LocalDate to) {
        try {
            LocalDate toDate = to != null ? to : LocalDate.now();
            LocalDate fromDate = from != null ? from : toDate.minusDays(DEFAULT_DAYS - 1L);

            if (fromDate.isAfter(toDate)) {
                throw new BadRequestException("from date must be less than or equal to to date");
            }

            LocalDateTime fromDateTime = fromDate.atStartOfDay();
            LocalDateTime toDateTime = toDate.atTime(LocalTime.MAX);

            DashboardUserStatsDto userStats = buildUserStats();
            DashboardOrderStatsDto orderStats = buildOrderStats(fromDateTime, toDateTime);
            DashboardRevenueStatsDto revenueStats = buildRevenueStats(fromDateTime, toDateTime);

            return DashboardResponse.builder()
                    .fromDate(fromDate)
                    .toDate(toDate)
                    .userStats(userStats)
                    .orderStats(orderStats)
                    .revenueStats(revenueStats)
                    .orderChart(buildOrderChart(fromDate, toDate, fromDateTime, toDateTime))
                    .revenueChart(buildRevenueChart(fromDate, toDate, fromDateTime, toDateTime))
                    .recentOrders(buildRecentOrders())
                    .recentUsers(buildRecentUsers())
                    .build();
        } catch (BadRequestException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new DashboardLoadException();
        }
    }

    private DashboardUserStatsDto buildUserStats() {
        long activeUsers = userRepository.countByIsActive(Boolean.TRUE);
        long totalUsers = userRepository.count();

        return DashboardUserStatsDto.builder()
                .totalUsers(totalUsers)
                .totalStaff(userRepository.countByRole(Role.STAFF))
                .totalCustomers(userRepository.countByRole(Role.CUSTOMER))
                .activeUsers(activeUsers)
                .inactiveUsers(totalUsers - activeUsers)
                .build();
    }

    private DashboardOrderStatsDto buildOrderStats(LocalDateTime fromDateTime, LocalDateTime toDateTime) {
        return DashboardOrderStatsDto.builder()
                .totalOrders(orderRepository.count())
                .ordersInRange(orderRepository.countByCreatedAtBetween(fromDateTime, toDateTime))
                .pendingOrders(orderRepository.countByStatus(OrderStatus.PENDING))
                .confirmedOrders(orderRepository.countByStatus(OrderStatus.CONFIRMED))
                .completedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED))
                .cancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED))
                .build();
    }

    private DashboardRevenueStatsDto buildRevenueStats(LocalDateTime fromDateTime, LocalDateTime toDateTime) {
        return DashboardRevenueStatsDto.builder()
                .totalRevenue(nonNullMoney(orderRepository.sumRevenueByStatus(OrderStatus.COMPLETED)))
                .revenueInRange(nonNullMoney(orderRepository
                        .sumRevenueByStatusAndCreatedAtBetween(OrderStatus.COMPLETED, fromDateTime, toDateTime)))
                .build();
    }

    private List<ChartPointDto> buildOrderChart(LocalDate fromDate,
                                                LocalDate toDate,
                                                LocalDateTime fromDateTime,
                                                LocalDateTime toDateTime) {
        Map<LocalDate, BigDecimal> groupedData = orderRepository.countOrdersGroupedByDay(fromDateTime, toDateTime)
                .stream()
                .collect(Collectors.toMap(
                        row -> toLocalDate(row[0]),
                        row -> BigDecimal.valueOf(((Number) row[1]).longValue())
                ));

        return buildDailyChart(fromDate, toDate, groupedData);
    }

    private List<ChartPointDto> buildRevenueChart(LocalDate fromDate,
                                                  LocalDate toDate,
                                                  LocalDateTime fromDateTime,
                                                  LocalDateTime toDateTime) {
        Map<LocalDate, BigDecimal> groupedData = orderRepository
                .sumRevenueGroupedByDay(OrderStatus.COMPLETED, fromDateTime, toDateTime)
                .stream()
                .collect(Collectors.toMap(
                        row -> toLocalDate(row[0]),
                        row -> nonNullMoney((BigDecimal) row[1])
                ));

        return buildDailyChart(fromDate, toDate, groupedData);
    }

    private List<ChartPointDto> buildDailyChart(LocalDate fromDate, LocalDate toDate, Map<LocalDate, BigDecimal> groupedData) {
        List<ChartPointDto> chart = new ArrayList<>();
        for (LocalDate date = fromDate; !date.isAfter(toDate); date = date.plusDays(1)) {
            chart.add(ChartPointDto.builder()
                    .label(date.toString())
                    .value(groupedData.getOrDefault(date, BigDecimal.ZERO))
                    .build());
        }
        return chart;
    }

    private List<RecentOrderDto> buildRecentOrders() {
        return orderRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(this::toRecentOrder)
                .toList();
    }

    private List<RecentUserDto> buildRecentUsers() {
        return userRepository.findTop5ByOrderByCreatedAtDesc().stream()
                .map(this::toRecentUser)
                .toList();
    }

    private RecentOrderDto toRecentOrder(Order order) {
        return RecentOrderDto.builder()
                .id(order.getId())
                .status(order.getStatus())
                .totalPrice(nonNullMoney(order.getTotalPrice()))
                .createdAt(order.getCreatedAt())
                .build();
    }

    private RecentUserDto toRecentUser(User user) {
        return RecentUserDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();
    }

    private LocalDate toLocalDate(Object value) {
        if (value instanceof LocalDate localDate) {
            return localDate;
        }
        if (value instanceof java.sql.Date sqlDate) {
            return sqlDate.toLocalDate();
        }
        return LocalDate.parse(value.toString());
    }

    private BigDecimal nonNullMoney(BigDecimal value) {
        return value != null ? value : BigDecimal.ZERO;
    }
}
