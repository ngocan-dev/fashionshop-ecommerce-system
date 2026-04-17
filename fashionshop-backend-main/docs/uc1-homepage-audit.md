# UC-1 Backend Verification: View Homepage Information

Date: 2026-04-06

## Scope
Verified implementation for UC-1 against code in dashboard/home module, security config, repositories, DTOs, and tests.

## Verdict by Check

1. Endpoint exists and is public: PASS
2. Response structure includes featured products, categories, banners: PASS
3. Basic flow (controller -> service -> aggregated data, with limits): PARTIAL
4. Error handling fallback for data-source failures: PASS
5. Performance and security: PARTIAL (no caching, potential N+1 on category access)

## Key Notes

- `GET /api/home` is implemented and returns `ApiResponse<HomeResponseDto>`.
- Security allows unauthenticated access to `/api/home/**`.
- Service aggregates three datasets in one response: featured products (top 8), active categories, active banners.
- Failures in home data retrieval are converted to `HomeDataLoadException` and mapped to HTTP 500 with message `Unable to load homepage`.
- Featured products are limited to 8, but categories and banners are unbounded active lists.
- No caching annotations/strategy found on home endpoint/service.
- Potential N+1 risk: mapping featured products reads `product.getCategory().getName()` while `Product.category` is LAZY and the repository method does not fetch-join category.
