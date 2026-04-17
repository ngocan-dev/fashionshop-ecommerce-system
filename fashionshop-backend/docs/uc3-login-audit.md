# UC-3 Log In Backend Audit

Date: 2026-04-06

## Scope reviewed
- Authentication login endpoint (`POST /api/auth/login`), DTO validation, and security accessibility.
- Credential verification flow (email lookup + password hash verification via Spring Security).
- JWT generation/signing/expiration and post-login authorization behavior.
- Error handling for invalid credentials, missing fields, and internal auth failures.
- Security controls for brute-force protection, lockout, logging, and transport expectations.

## Evidence (code + checks)
- Route/controller: `AuthController.login`.
- Service logic: `AuthServiceImpl.login`.
- Security policy: `SecurityConfig` and `JwtAuthenticationFilter`.
- JWT internals: `JwtService` and `application.properties`.
- Validation and exception mapping: `LoginRequest`, `GlobalExceptionHandler`, and auth tests.
- Command run: `./mvnw -q -Dtest=AuthServiceImplTest,AuthControllerValidationTest test` (could not complete in this environment because Maven distribution download failed).

## Verdict by requirement

1. **Endpoint exists/public + accepts `{email,password}`**: **PASS**
2. **Credential validation with secure hashing**: **PASS**
3. **Session/token creation on success**: **PARTIAL**
   - JWT is generated, signed, and has expiration.
   - Role is returned in response, but not embedded as JWT claim.
4. **Success response & sensitive data hygiene**: **PARTIAL**
   - Returns token + user info; password/hash not exposed.
   - No redirect/dashboard URL in response.
   - Internal numeric `userId` is exposed (may be acceptable, but review policy).
5. **Invalid credentials handling**: **FAIL**
   - Returns `400` today; requirement expects `401`.
   - Generic message is correct (`Invalid email or password`).
6. **Missing fields handling**: **PASS**
   - Server-side validation with `400` and `Please fill in all required fields`.
7. **System/auth failure handling**: **PASS (with caution)**
   - Login wraps unexpected errors into safe `500` message.
   - Global fallback handler elsewhere may leak exception messages.
8. **Security controls (rate-limit/lockout/audit/HTTPS enforcement)**: **FAIL/PARTIAL**
   - No explicit rate limiting, lockout, or login-attempt audit logging found.
   - HTTPS enforcement not explicit in Spring Security config (likely expected at gateway/proxy).
9. **Post-login permissions by role**: **PASS**
   - Role-based access control exists for CUSTOMER/STAFF/ADMIN paths.

## Critical issues to fix before release
- Return **401 Unauthorized** for invalid login credentials (not 400).
- Add **rate limiting** and **account lockout/backoff** for brute-force protection.
- Add **security audit logs** for login success/failure (timestamp, IP, user-agent).

## Recommended improvements
- Include a role-based `redirectUrl` in login response if frontend depends on backend-guided routing.
- Consider adding role claim to JWT (or document current DB-backed authority resolution).
- Replace catch-all error response text with fully generic message to avoid accidental leakage.
