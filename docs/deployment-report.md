# Cloud Deployment of FashionShop Using Vercel and Railway

Working implementation record, 24 November 2026 (Asia/Saigon). This document preserves the pre-report outline. Statements marked Pending are planned work, not successful cloud results. The original Word report is unchanged.

## 1. INTRODUCTION

### 1.1 Overview

FashionShop uses Next.js, Spring Boot and MySQL. The deployment target has changed from AWS EC2 and Ubuntu to Vercel and Railway because AWS account setup prevented the original route. The objective remains public application access and practical administration of configuration, networking, security and application operations. Host operating systems, ingress infrastructure and underlying servers are administered by the platforms, not the project team.

### 1.2 Architecture

| Component | Target | Status |
| --- | --- | --- |
| Frontend | Next.js on Vercel | Production build verified locally; cloud pending |
| Backend | Java 17 Docker container on Railway | JAR verified locally; Docker/cloud pending |
| Database | MySQL 8 with persistent volume on Railway | Provisioning and schema validation pending |
| Source checks | GitHub Actions | Workflow written; remote execution pending |
| Monitoring | Backend readiness endpoint and later external uptime checks | Endpoint tested locally; uptime monitoring pending |

### 1.3 Operation

The browser loads the frontend from Vercel using HTTPS. Client-side API calls go from the browser directly to the public Railway backend with a JWT when required. Spring Boot accesses MySQL through Railway private networking. MySQL credentials never belong in frontend variables. There is no team-managed SSH server, Nginx or Ubuntu host in this topology.

## 2. IMPLEMENTATION

### 2.1 Network Topology

```text
Browser --HTTPS--> Vercel / Next.js
Browser --HTTPS + REST/JWT--> Railway / Spring Boot
Railway / Spring Boot --private JDBC--> Railway / MySQL + volume
GitHub --CI checks--> release candidate (deployment gate still pending)
```

| Connection | Configuration | Exposure |
| --- | --- | --- |
| Browser to frontend | Actual Vercel hostname, to be recorded | Public HTTPS |
| Browser to backend | Actual Railway hostname, to be recorded | Public HTTPS |
| Platform to backend | PORT environment variable; default 8081 | Container listener |
| Backend to database | Private hostname and actual MySQL port | Private environment network |

Private networking must be configured on the platform; a JDBC variable alone does not prove isolation. Record service settings and verify that no public database TCP proxy remains after bootstrap.

### 2.2 Installation

#### Step 1 Prepare source code and local checks

Implemented: backend multi-stage Dockerfile with Java 17 runtime and non-root user; allowlisted Docker context; production profile; environment examples; frontend API fallback corrected from port 8080 to 8081; CI workflow.

Run from the respective component directories:

```powershell
# Backend
.\mvnw.cmd -B verify
# Frontend (use Node 22 for parity with CI)
npm ci
npm run lint
npm run test:run
npm run build
```

Docker build skips tests because CI runs them separately. Do not treat image creation as test evidence. Docker is not available in the inspected local environment, so image build/start is not yet verified.

#### Step 2 Create Railway database — Pending

1. Create the project/environment and a MySQL service with persistent storage. Verify the MySQL version against the supplied MySQL 8 dump.
2. Create an empty database and import `database/ecommerce_db.sql` once. It contains DROP TABLE statements; never run it against data that must be preserved.
3. Use an administration credential for import and a separate application user with SELECT, INSERT, UPDATE and DELETE on that database. The production profile validates schema and does not run DDL.
4. Use an internal execution path for import where available. If using a temporary public database proxy, use the platform's actual host/port and remove that proxy after import.
5. Record the actual private hostname, database name and volume settings, with credentials redacted.

#### Step 3 Deploy backend — Pending

1. Connect the repository; set service root to `fashionshop-backend`, using its Dockerfile.
2. Set variables listed in section 2.3. Do not configure a start command that overrides the image entrypoint.
3. Import schema before starting the production profile. Investigate any Hibernate validation mismatch rather than disabling validation to conceal it.
4. Configure public networking for the container's actual PORT and readiness path `/api/health`, allowing sufficient Java startup time (for example 120 seconds).
5. Verify HTTP 200 with `{"status":"UP"}` and `/api/home`. Record deployment ID and commit.

#### Step 4 Deploy frontend — Pending

1. Import the same repository in Vercel; root directory `fashionshop-frontend`; framework Next.js; Node 22; build `npm run build`; retain framework output defaults.
2. Set `NEXT_PUBLIC_API_BASE_URL=https://<actual-backend-domain>` without an `/api` suffix. Set it before building; never deploy the localhost value.
3. Deploy, then put the actual production Vercel origin in backend CORS configuration and redeploy backend.
4. Allow preview origins individually only when testing them; do not allow all `*.vercel.app` tenants. Do not connect untrusted preview code to sensitive production data.
5. Verify browser Network requests, login and order workflows from another device.

### 2.3 Configuration

#### Step 1 Environment variables and secrets

| Variable | Target | Requirement |
| --- | --- | --- |
| SPRING_PROFILES_ACTIVE | Backend | prod |
| SPRING_DATASOURCE_URL | Backend | JDBC URL with actual private host, port and database |
| SPRING_DATASOURCE_USERNAME | Backend | Dedicated application user |
| SPRING_DATASOURCE_PASSWORD | Backend | Platform secret |
| JWT_SECRET | Backend | Base64 encoding of at least 32 cryptographically random bytes |
| APP_CORS_ALLOWED_ORIGINS | Backend | Exact frontend origin; comma-separated if necessary; no trailing slash |
| PORT | Backend | Platform-assigned listener port, fallback 8081 |
| NEXT_PUBLIC_API_BASE_URL | Frontend | Public HTTPS API origin, baked into build |

`env.example` is documentation, not an automatically loaded backend environment file. For local backend startup, set JWT_SECRET and database credentials in the process environment. The checked-in JWT fallback and database password were removed. Previously committed credentials remain in Git history and must be replaced for cloud use. Do not reuse demo passwords for privileged public accounts.

Example local key generation in PowerShell (does not print the key):

```powershell
$jwtBytes = New-Object byte[] 32
$jwtRng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$jwtRng.GetBytes($jwtBytes)
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
$jwtRng.Dispose()
```

#### Step 2 Database and stock behavior

Production uses `ddl-auto=validate`, SQL logging disabled, a maximum pool of five connections and a five-second acquisition timeout. Compatibility with the imported MySQL schema remains to be verified. Automatic stock replenishment is disabled by default; explicit local opt-in is `APP_DEMO_INITIALIZE_STOCK=true`. Keep this disabled on cloud. Prepare intentional demo stock as data, not as startup mutation.

#### Step 3 CORS and authorization

The duplicate MVC CORS configuration was removed. Spring Security is the single CORS source, reading exact origins from configuration. Tests cover allowed and disallowed preflight requests. CORS is a browser policy, not authentication; role and JWT enforcement need separate cloud test evidence. Existing business authorization has not been comprehensively audited in this step.

#### Step 4 CI/CD

`.github/workflows/ci.yml` runs backend verify and frontend lint/test/build on pushes and pull requests using Java 17 and Node 22. It has read-only repository permission and no deployment secrets. This is CI preparation, not completed CD. Configure required checks on the release branch where available, restrict direct release pushes, and ensure platforms only deploy approved commits. A separate automatic deployment triggered before CI finishes is not a validated gate. Current frontend failures must be resolved before approving release.

#### Step 5 Health checks and logging

`GET /api/health` is public and checks the database with SELECT 1. It returns only UP (200) or DOWN (503), never connection details. This measures readiness, not process-only liveness. A temporary database outage should not be interpreted as proof the JVM must be restarted. Platform deployment checks do not replace continuous monitoring. External uptime checks, request correlation and alert delivery remain planned.

#### Step 6 Backup and recovery — Pending

Export a logical MySQL backup using credentials outside command-line arguments; store it outside the database volume and outside Git. Restore to a separate disposable database, compare table counts and a selected order, and record elapsed recovery time. Do not destroy the live demo database for the exercise. Record backup timestamp and explain the potential data-loss window. Platform snapshot availability must be checked for the selected plan.

For application rollback, retain the last good commit and record the platform deployment. Use a backward-compatible change for the exercise; application rollback does not restore schema or data. Build rollback and database restore are separate results.

## 3. RESULTS

### 3.1 Deployment and Testing Scenarios

Local verification on 24 November 2026 used Windows, Java 21.0.10 and Node 24.14.1. CI targets Java 17 and Node 22, so runtime parity is not yet established.

| Scenario | Actual result | Evidence / remaining work |
| --- | --- | --- |
| Backend verify/package | PASS: 135 tests, zero failures/errors/skips; JAR packaged | Local backend build-verification.log; includes five new deployment tests |
| Allowed/disallowed CORS | PASS locally with real security chain | DeploymentConfigurationTest; H2 environment |
| Readiness success and DB failure | PASS locally | Public UP integration test; DOWN unit test with simulated DB error |
| Automatic stock initialization disabled | PASS locally | Application context has no DataInitializer by default |
| Frontend production build | PASS after sandbox process restriction was removed | Local frontend build-verification.log |
| Frontend lint | FAIL: 48 errors and 33 warnings | Local lint-verification.log; release blocker |
| Frontend tests | FAIL: 3 failed, 9 passed across 9 files | Local test-verification.log; release blocker |
| Docker build and Java 17 container startup | NOT RUN | Docker unavailable locally |
| MySQL schema validation and persistence | NOT RUN | Requires provisioned MySQL; H2 tests are not proof |
| Public HTTPS and cross-device workflows | NOT RUN | Requires cloud deployment |
| CI gate and remote workflow | NOT RUN | Workflow has not been pushed/executed |
| Backup restore and rollback | NOT RUN | Advanced experiments pending |
| Monitoring and load measurements | NOT RUN | No uptime or performance claim made |

Initial frontend test/build attempts failed with spawn EPERM in the sandbox. A rerun with subprocess access completed the production build and exposed actual test failures. The local log files are intentionally ignored by Git; retain redacted screenshots or selected output for final submission.

For each future cloud scenario record: timestamp, commit/deployment ID, preconditions, steps, expected result, actual result and evidence filename. Replace planned results only after the corresponding experiment succeeds.

### 3.2 Summary

The repository now contains deployment configuration and backend readiness checks. Local backend checks and frontend production build pass. The project is not yet verified on Vercel/Railway and frontend quality checks still block a clean release. Next steps are resolving those failures, validating Docker and the MySQL schema, provisioning the cloud services, and collecting operation/recovery evidence. Payment gateways remain mocks; the report must describe simulated payments accurately.

### Implementation log

| Step | Work completed | Status |
| --- | --- | --- |
| 1 | Inspected repository, frontend instructions and current deployment settings | Complete |
| 2 | Externalized secrets, added prod profile/PORT, unified CORS, disabled implicit stock mutation | Complete locally |
| 3 | Added non-root Dockerfile, environment examples and CI workflow | Prepared; platform validation pending |
| 4 | Added readiness controller and security/configuration regression tests | Local tests passed |
| 5 | Ran checks and documented actual failures without disabling gates | Complete |
| 6 | Deploy and execute advanced experiments | Pending |
