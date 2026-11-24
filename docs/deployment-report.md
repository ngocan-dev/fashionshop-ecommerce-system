# Cloud Deployment of FashionShop Using Vercel and Railway

Working implementation record, 24 November 2026 (Asia/Saigon). This document preserves the pre-report outline. Statements marked Pending are planned work, not successful cloud results. The original Word report is unchanged.

Revision basis: instructor feedback on the pre-report. Keep Overview, use Figure 2.1 to explain Operation, expand Architecture with additional operational services, include command-line verification and screenshots in Installation and Configuration, capture both service-side and client-side evidence for scenarios, and add section 3.2 Cost. Summary moves to 3.3. AWS is not part of the revised deployment. Lab 6 instructions have not been supplied, so the advanced scope below is proposed rather than claimed to exceed a verified rubric.

## 1. INTRODUCTION

### 1.1 Overview

FashionShop uses Next.js, Spring Boot and MySQL. The deployment target has changed from AWS EC2 and Ubuntu to Vercel and Railway because AWS account setup prevented the original route. The objective remains public application access and practical administration of configuration, networking, security and application operations. Host operating systems, ingress infrastructure and underlying servers are administered by the platforms, not the project team.

### 1.2 Architecture

The system retains three logical application tiers while delegating host administration to managed platforms. Vercel hosts the Next.js application and serves the browser interface. Railway runs the Spring Boot container and the MySQL service with persistent storage. Only the web application and backend API require public HTTPS endpoints. Database traffic stays within the Railway project environment. This design separates application responsibilities; it does not by itself provide database high availability or guarantee zero downtime.

#### 1.2.1 Core application components

| Component | Target | Status |
| --- | --- | --- |
| Frontend | Next.js on Vercel | Production build verified locally; cloud pending |
| Backend | Java 17 Docker container on Railway | JAR verified locally; Docker/cloud pending |
| Database | MySQL 8 with persistent volume on Railway | Provisioning and schema validation pending |
| Source checks | GitHub Actions | Workflow written; remote execution pending |
| Monitoring | Backend readiness endpoint and later external uptime checks | Endpoint tested locally; uptime monitoring pending |

#### 1.2.2 Additional services for advanced scope

| Additional service or mechanism | Responsibility and integration | Demonstration beyond basic deployment | Current status |
| --- | --- | --- | --- |
| GitHub Actions and release controls | Run frontend/backend checks; release only the approved commit to hosting platforms | Failed checks prevent release; successful commit can be traced to deployment | CI file prepared; remote gate pending |
| External HTTPS uptime monitor | Periodically request backend readiness URL and notify the operator of failures | Detect a controlled interruption and measure detection/recovery time | Service selection and setup pending |
| Railway service logs and resource metrics | Inspect startup/runtime events and CPU/RAM around an incident | Correlate client error timestamps with service evidence | Cloud collection pending |
| Backup job and independent backup storage | Export MySQL on a schedule and keep the copy outside the database service/volume | Restore into an isolated database and verify data and recovery time | Scheduler and storage destination pending |
| Application rollback procedure | Record last good commit/deployment; return to it after a controlled faulty release | Demonstrate service restoration while preserving compatible data | Pending |

GitHub Actions is a separate automation service; uptime monitoring is an additional planned service. Private networking, environment secrets, logs, volume storage and platform HTTPS are platform capabilities, not separately implemented servers. The backup destination and monitor must be named in the final report once selected; do not invent a provider or claim an unconfigured service is active.

#### 1.2.3 Responsibility boundary

The platforms operate the underlying hosts, public ingress and platform-managed TLS. The team configures application builds, environment variables, API authorization, CORS, database permissions, private connections, deployment controls and recovery procedures. The report makes no claim of team-managed EC2, Ubuntu, SSH, UFW, systemd or Nginx. Advanced credit should be supported by the experiments in section 3.1 and checked against the actual Lab 6 baseline.

### 1.3 Operation

The browser loads the frontend from Vercel using HTTPS. Client-side API calls go from the browser directly to the public Railway backend with a JWT when required. Spring Boot accesses MySQL through Railway private networking. MySQL credentials never belong in frontend variables. There is no team-managed SSH server, Nginx or Ubuntu host in this topology.

Use Figure 2.1 in section 2.1 to explain this sequence: (1) load the frontend, (2) send the API request, (3) validate authentication/authorization and query MySQL, and (4) return data to the browser. Automation, monitoring and backup arrows describe operational traffic, not the customer request path. No duplicate operation figure is required.

## 2. IMPLEMENTATION

### 2.1 Network Topology

```text
Browser --(1) HTTPS--> Vercel / Next.js
Browser --(2) HTTPS + REST/JWT--> Railway / Spring Boot
Railway / Spring Boot --(3) private JDBC--> Railway / MySQL + volume
Railway / MySQL --query result--> Spring Boot --(4) JSON--> Browser

GitHub Actions --approved release--> Vercel and Railway [pending]
External monitor --HTTPS readiness request--> Spring Boot [pending]
Backup job --authorized database export--> independent storage [pending]
```

Figure 2.1. Proposed FashionShop network topology on Vercel and Railway, including advanced operational components. Replace this text drawing with the final rendered diagram before Word submission; retain the public/private boundary and pending labels until implementation is complete.

| Connection | Configuration | Exposure |
| --- | --- | --- |
| Browser to frontend | Actual Vercel hostname, to be recorded | Public HTTPS |
| Browser to backend | Actual Railway hostname, to be recorded | Public HTTPS |
| Platform to backend | PORT environment variable; default 8081 | Container listener |
| Backend to database | Private hostname and actual MySQL port | Private environment network |

Private networking must be configured on the platform; a JDBC variable alone does not prove isolation. Record service settings and verify that no public database TCP proxy remains after bootstrap.

### 2.2 Installation

For every step use this reporting sequence: objective, actual command or dashboard action, verification command, expected output, actual output, and screenshot. Dashboard-only provisioning is legitimate on PaaS: report the actual UI action and supplement it with CLI verification rather than inventing Linux installation commands. Commands below are templates unless a result is explicitly recorded in section 3.1. Run PowerShell commands from the repository root unless a component directory is stated. Replace angle-bracket placeholders first.

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

Environment verification commands:

```powershell
git --version
java -version
node --version
npm --version
# Only on a machine with Docker installed:
docker version
docker build -t fashionshop-backend:report ./fashionshop-backend
```

Figure 2.2 [Pending capture]: tool versions and build verification terminal output. Show command, exit/result summary and runtime versions; do not present local Java 21 evidence as a Java 17 container test.

#### Step 2 Create Railway database — Pending

1. Create the project/environment and a MySQL service with persistent storage. Verify the MySQL version against the supplied MySQL 8 dump.
2. Create an empty database and import `database/ecommerce_db.sql` once. It contains DROP TABLE statements; never run it against data that must be preserved.
3. Use an administration credential for import and a separate application user with SELECT, INSERT, UPDATE and DELETE on that database. The production profile validates schema and does not run DDL.
4. Use an internal execution path for import where available. If using a temporary public database proxy, use the platform's actual host/port and remove that proxy after import.
5. Record the actual private hostname, database name and volume settings, with credentials redacted.

Example verification from an authorized machine with the MySQL client and a reachable database endpoint (password entered at the prompt):

```powershell
mysql --host=<reachable-db-host> --port=<db-port> --user=<admin-user> --password --database=<db-name> --execute="SELECT VERSION(), DATABASE(); SHOW TABLES;"
```

Run the import only against the new, empty demo database:

```powershell
mysql --host=<reachable-db-host> --port=<db-port> --user=<admin-user> --password --database=<db-name> --execute="SOURCE database/ecommerce_db.sql;"
```

The private Railway hostname is not directly reachable from the local laptop. Document whether the command ran inside the private network or through an explicitly temporary proxy. Figure 2.3 [Pending]: database/volume configuration and terminal schema verification. Redact credentials and remove any temporary public proxy afterward.

#### Step 3 Deploy backend — Pending

1. Connect the repository; set service root to `fashionshop-backend`, using its Dockerfile.
2. Set variables listed in section 2.3. Do not configure a start command that overrides the image entrypoint.
3. Import schema before starting the production profile. Investigate any Hibernate validation mismatch rather than disabling validation to conceal it.
4. Configure public networking for the container's actual PORT and readiness path `/api/health`, allowing sufficient Java startup time (for example 120 seconds).
5. Verify HTTP 200 with `{"status":"UP"}` and `/api/home`. Record deployment ID and commit.

```powershell
$backendUrl = 'https://<actual-backend-domain>'
curl.exe -i "$backendUrl/api/health"
curl.exe -i "$backendUrl/api/home"
```

Figure 2.4 [Pending]: Railway successful deployment/startup log with commit/deployment ID. Figure 2.5 [Pending]: client terminal showing HTTPS status and health/API response. An HTTP response from the laptop alone is not server-side evidence.

#### Step 4 Deploy frontend — Pending

1. Import the same repository in Vercel; root directory `fashionshop-frontend`; framework Next.js; Node 22; build `npm run build`; retain framework output defaults.
2. Set `NEXT_PUBLIC_API_BASE_URL=https://<actual-backend-domain>` without an `/api` suffix. Set it before building; never deploy the localhost value.
3. Deploy, then put the actual production Vercel origin in backend CORS configuration and redeploy backend.
4. Allow preview origins individually only when testing them; do not allow all `*.vercel.app` tenants. Do not connect untrusted preview code to sensitive production data.
5. Verify browser Network requests, login and order workflows from another device.

```powershell
$frontendUrl = 'https://<actual-frontend-domain>'
curl.exe -I "$frontendUrl"
```

Figure 2.6 [Pending]: Vercel build/deployment status and commit. Figure 2.7 [Pending]: rendered homepage plus browser Network panel showing the actual backend HTTPS origin. A successful HEAD request proves HTTP reachability, not interactive application correctness.

### 2.3 Configuration

Retain the same objective/action/command/verify/screenshot sequence as Installation. Configuration screenshots must hide variable values, tokens, database passwords and authorization headers.

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

Safe local verification (prints only a length, not the key):

```powershell
[Convert]::FromBase64String($env:JWT_SECRET).Length
```

Expected minimum: 32 bytes. Figure 2.8 [Pending]: platform variable names with values hidden and a startup result showing the intended profile. Do not screenshot generated secrets.

#### Step 2 Database and stock behavior

Production uses `ddl-auto=validate`, SQL logging disabled, a maximum pool of five connections and a five-second acquisition timeout. Compatibility with the imported MySQL schema remains to be verified. Automatic stock replenishment is disabled by default; explicit local opt-in is `APP_DEMO_INITIALIZE_STOCK=true`. Keep this disabled on cloud. Prepare intentional demo stock as data, not as startup mutation.

Verify with the application database user:

```powershell
mysql --host=<reachable-db-host> --port=<db-port> --user=<app-user> --password --database=<db-name> --execute="SELECT CURRENT_USER(), DATABASE(); SHOW GRANTS FOR CURRENT_USER();"
```

Figure 2.9 [Pending]: private networking settings without a public database proxy, application-user grants and successful backend schema validation. Compare selected stock values before/after a restart to verify that startup does not replenish them.

#### Step 3 CORS and authorization

The duplicate MVC CORS configuration was removed. Spring Security is the single CORS source, reading exact origins from configuration. Tests cover allowed and disallowed preflight requests. CORS is a browser policy, not authentication; role and JWT enforcement need separate cloud test evidence. Existing business authorization has not been comprehensively audited in this step.

```powershell
curl.exe -i -X OPTIONS "$backendUrl/api/products" -H "Origin: $frontendUrl" -H "Access-Control-Request-Method: GET"
curl.exe -i -X OPTIONS "$backendUrl/api/products" -H "Origin: https://untrusted.example.com" -H "Access-Control-Request-Method: GET"
```

Expected: the allowed preflight contains the exact Access-Control-Allow-Origin; the rejected preflight has no allow header and is rejected by the current configuration. Curl does not enforce browser CORS, so also capture the browser behavior. Figure 2.10 [Pending]: paired preflight output and browser verification; add separate JWT/role tests in Results.

#### Step 4 CI/CD

`.github/workflows/ci.yml` runs backend verify and frontend lint/test/build on pushes and pull requests using Java 17 and Node 22. It has read-only repository permission and no deployment secrets. This is CI preparation, not completed CD. Configure required checks on the release branch where available, restrict direct release pushes, and ensure platforms only deploy approved commits. A separate automatic deployment triggered before CI finishes is not a validated gate. The frontend failures recorded in the initial preparation have now been resolved locally (see the follow-up verification in section 3.1). Remote required checks and the actual release gate still need verification.

```powershell
git rev-parse HEAD
git log -1 --format="%h %s"
```

Match that commit against the remote CI run and both deployments. Figure 2.11 [Pending]: passing and intentionally failed checks, actual release control settings and unchanged active deployment after the failed candidate. Never introduce a failing experiment directly into the live release branch.

#### Step 5 Health checks and logging

`GET /api/health` is public and checks the database with SELECT 1. It returns only UP (200) or DOWN (503), never connection details. This measures readiness, not process-only liveness. A temporary database outage should not be interpreted as proof the JVM must be restarted. Platform deployment checks do not replace continuous monitoring. External uptime checks, request correlation and alert delivery remain planned.

```powershell
Get-Date -Format o
curl.exe -i --max-time 15 "$backendUrl/api/health"
```

Figure 2.12 [Pending]: health-check setting, external monitor interval, service event/log timestamp and corresponding client response. Capture the incident and recovery, including notification if implemented. Do not claim alerts are implemented from a health endpoint alone.

#### Step 6 Backup and recovery — Pending

Export a logical MySQL backup using credentials outside command-line arguments; store it outside the database volume and outside Git. Restore to a separate disposable database, compare table counts and a selected order, and record elapsed recovery time. Do not destroy the live demo database for the exercise. Record backup timestamp and explain the potential data-loss window. Platform snapshot availability must be checked for the selected plan.

For application rollback, retain the last good commit and record the platform deployment. Use a backward-compatible change for the exercise; application rollback does not restore schema or data. Build rollback and database restore are separate results.

Example logical export to a local directory outside version control (run from an authorized host with MySQL tools; check the exit code and inspect for errors):

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
mysqldump --host=<reachable-db-host> --port=<db-port> --user=<backup-user> --password --single-transaction --no-tablespaces --set-gtid-purged=OFF --result-file=backups/fashionshop.sql <db-name>
$LASTEXITCODE
Get-Item backups/fashionshop.sql | Select-Object Name, Length, LastWriteTime
```

Restore only into a separately created empty test database:

```powershell
mysql --host=<restore-host> --port=<restore-port> --user=<restore-user> --password --database=<empty-restore-db> --execute="SOURCE backups/fashionshop.sql;"
$LASTEXITCODE
```

Use appropriate separate backup/restore permissions and compare table counts plus selected business records in source and restored databases. A nonempty file is not sufficient validation. Figure 2.13 [Pending]: export/restore output, matching records and elapsed recovery time. Figure 2.14 [Pending]: deployment history before/after rollback and successful client smoke test. These manual commands do not establish scheduled backups; document the scheduler, destination, retention and a successful scheduled run if that advanced service is implemented.

## 3. RESULTS

### 3.1 Deployment and Testing Scenarios

Local verification on 24 November 2026 used Windows, Java 21.0.10 and Node 24.14.1. CI targets Java 17 and Node 22, so runtime parity is not yet established.

| Scenario | Actual result | Evidence / remaining work |
| --- | --- | --- |
| Backend verify/package | PASS: 135 tests, zero failures/errors/skips; JAR packaged | Local backend build-verification.log; includes five new deployment tests |
| Allowed/disallowed CORS | PASS locally with real security chain | DeploymentConfigurationTest; H2 environment |
| Readiness success and DB failure | PASS locally | Public UP integration test; DOWN unit test with simulated DB error |
| Automatic stock initialization disabled | PASS locally | Application context has no DataInitializer by default |
| Frontend production build | PASS again after frontend corrections, including TypeScript check | Local frontend build-verification.log; middleware convention deprecation warning remains |
| Frontend lint | PASS on follow-up: 0 errors, 15 warnings (initially 48 errors, 33 warnings) | Local lint-verification.log; nonblocking warnings remain |
| Frontend tests | PASS on follow-up: 14 tests across 10 files (initially 3 failed, 9 passed) | Local test-verification.log; includes two new checkout regression tests |
| Docker build and Java 17 container startup | NOT RUN | Docker unavailable locally |
| MySQL schema validation and persistence | NOT RUN | Requires provisioned MySQL; H2 tests are not proof |
| Public HTTPS and cross-device workflows | NOT RUN | Requires cloud deployment |
| CI gate and remote workflow | NOT RUN | Workflow has not been pushed/executed |
| Backup restore and rollback | NOT RUN | Advanced experiments pending |
| Monitoring and load measurements | NOT RUN | No uptime or performance claim made |

Initial frontend test/build attempts failed with spawn EPERM in the sandbox. A rerun with subprocess access completed the production build and exposed actual test failures. The local log files are intentionally ignored by Git; retain redacted screenshots or selected output for final submission.

For each future cloud scenario record: timestamp, commit/deployment ID, preconditions, steps, expected result, actual result and evidence filename. Replace planned results only after the corresponding experiment succeeds.

#### Follow-up frontend verification on 24 November 2026

Step 1: repaired the test environment. Each test render receives a fresh QueryClientProvider, with retries disabled. The product listing test mocks API service responses and waits for the asynchronous result; it no longer assumes a hardcoded catalog or a live backend. Authentication validation tests use the actual query provider.

Step 2: resolved lint errors without disabling rules. Added explicit API response types for orders, products and account lists, typed wishlist cache entries, separated Zod form input/output types and converted fallback category IDs to numbers. Replaced empty interfaces with type aliases and escaped JSX text. Removed unused imports and stabilized memo dependencies. Checkout payment selection now uses useWatch.

Step 3: removed render-time Date.now calls from checkout confirmation. Session storage is read through useSyncExternalStore with a stable string snapshot and server snapshot. Missing order numbers display Unavailable instead of an invented identifier; the estimate is a relative 7–14 days. Two regression tests cover a stored order and malformed stored JSON. This change does not establish that payment succeeded; payment integration remains simulated.

Step 4: verified locally using Node 24.14.1. Commands ran in fashionshop-frontend:

```powershell
npm run lint
npm run test:run
npm run build
```

Results: lint exit 0, 0 errors and 15 warnings; test exit 0, 14/14 tests in 10 files; build exit 0, including TypeScript validation and route generation. The remaining warnings concern existing image/font optimization and unused declarations. No ESLint rule, test assertion or CI gate was disabled. Build still reports the existing middleware-to-proxy convention deprecation. These are local results, not Node 22 CI, browser E2E or cloud deployment results.

Figure 3.0a [Pending capture]: local terminal lint summary and complete test summary. Figure 3.0b [Pending capture]: production build result and route summary. These are local preparation evidence only; retain the paired cloud service/client captures for S01–S10 below.

#### Cloud scenario evidence from two viewpoints

On Vercel/Railway, "server viewpoint" means the relevant service deployment, logs, runtime metrics, database query output or configuration, rather than an EC2 SSH terminal. The client viewpoint is the actual browser or client-side terminal response. Use the same test window and commit IDs; synchronize timestamps/timezone. A platform dashboard showing Healthy alone cannot prove an individual request was handled correctly.

| Scenario | Objective / expected result | Server or service-side image | Client-side image | Cloud result |
| --- | --- | --- | --- | --- |
| S01 Service readiness | Deployment starts and database readiness succeeds | Figure 3.1a: Railway startup/readiness evidence | Figure 3.1b: HTTP 200 UP | Pending |
| S02 Web accessibility | Public HTTPS frontend loads | Figure 3.2a: Vercel deployment and matching commit | Figure 3.2b: rendered website and HTTPS connection | Pending |
| S03 Backend connectivity | Actual frontend API request succeeds | Figure 3.3a: corresponding service request log, when available | Figure 3.3b: DevTools URL/status/body with secrets hidden | Pending |
| S04 Database persistence | Created demo order survives backend redeploy | Figure 3.4a: database record before/after and redeploy event | Figure 3.4b: same order visible after reload | Pending |
| S05 Role functionality | CUSTOMER, STAFF and ADMIN follow allowed workflows | Figure 3.5a: role assignment and relevant sanitized audit/log evidence | Figure 3.5b: allowed function and denied unauthorized request | Pending |
| S06 Origin control | Allowed origin succeeds; unrelated origin is rejected | Figure 3.6a: configured exact origins and service evidence | Figure 3.6b: allowed/rejected browser or preflight results | Pending |
| S07 Release gate | Failed candidate is not released | Figure 3.7a: failed CI, gate and unchanged deployment ID | Figure 3.7b: existing working app still accessible | Pending |
| S08 Monitoring and recovery | Controlled restart is detected and recovery observed | Figure 3.8a: service restart log/metrics | Figure 3.8b: external monitor event/notification and recovery | Pending |
| S09 Backup restore | Isolated restored data matches the backup state | Figure 3.9a: restore execution and database comparison | Figure 3.9b: client SQL query to isolated restored DB, or isolated app UI | Pending |
| S10 Application rollback | Last good version restores the tested function | Figure 3.10a: deployment history and active version | Figure 3.10b: before/after client result | Pending |

For S03/S05, if the current logs do not contain request evidence, add suitable sanitized request/audit logging or explicitly state the evidence gap. Do not fabricate log entries. Each scenario should include observed HTTP status, time and interpretation beneath the paired figures; do not submit screenshots without an explanation.

### 3.2 Cost

#### 3.2.1 Cost components

| Component | Cost to record | Evidence source |
| --- | --- | --- |
| Vercel frontend | Actual plan fee, usage and any billable extras | Vercel plan/usage/billing page |
| Railway backend | CPU, memory and outbound transfer attributed to backend | Railway service usage and project billing |
| Railway MySQL | CPU, memory, persistent volume and relevant transfer | Database service usage and storage settings |
| Railway plan | Minimum/subscription and included usage credits, according to the actual selected plan | Current account billing terms; avoid double counting included usage |
| GitHub Actions | Billable workflow usage, if any | Account Actions usage |
| External monitor | Actual selected service plan | Monitor subscription/usage |
| Independent backup storage | Storage, transfer and scheduled-job compute, if applicable | Selected storage/job usage |
| Custom domain | Zero purchase cost if only platform-provided domains are used; otherwise actual registration cost | Domain receipt, if any |

#### 3.2.2 Demo-period cost and monthly estimate

Record start/end dates, hours of service activity, chosen plans, actual resource charges, applied credits and amount paid. Free credits reduce cash payment; they do not mean the underlying resource consumption has no cost. Do not copy AWS prices or assume previously quoted platform prices still apply at billing time.

| Measurement | Actual value | Source |
| --- | --- | --- |
| Deployment observation period | Pending | Deployment timestamps |
| Resource/plan charges before credits | Pending | Billing breakdown |
| Trial/promotional credits applied | Pending | Billing breakdown |
| Actual amount payable, including applicable taxes | Pending | Invoice or current billing statement |
| Estimated monthly cost without trial credits | Pending | Measured daily resource use plus actual plan rules |

For a rough projection, multiply measured average daily variable usage by 30, then apply each provider's actual included usage/minimum charges and add fixed extras without double counting. State the observation window and assumption of similar traffic, sleep behavior and database storage. The estimate is not an invoice or a guarantee.

Figure 3.11 [Pending]: Railway usage/billing with observation dates. Figure 3.12 [Pending]: Vercel plan/usage and any additional-service charges. Hide payment details and personal billing information.

#### 3.2.3 Cost control

Prepare locally before creating cloud resources, inspect usage during the demo, create restore resources only for the experiment, remove them after saving required evidence, and export needed data before shutdown. Explain whether scheduled monitoring prevents services from sleeping and how this affects both availability measurements and cost. Record final resource shutdown separately from application success.

### 3.3 Summary

The repository now contains deployment configuration and backend readiness checks. Local backend checks and frontend production build pass. Frontend lint, tests and production build now pass locally, with 15 nonblocking lint warnings recorded. The project is not yet verified on Vercel/Railway. Next steps are validating Node 22 CI, Docker and the MySQL schema, provisioning the cloud services, and collecting operation/recovery evidence. Payment gateways remain mocks; the report must describe simulated payments accurately.

### Implementation log

| Step | Work completed | Status |
| --- | --- | --- |
| 1 | Inspected repository, frontend instructions and current deployment settings | Complete |
| 2 | Externalized secrets, added prod profile/PORT, unified CORS, disabled implicit stock mutation | Complete locally |
| 3 | Added non-root Dockerfile, environment examples and CI workflow | Prepared; platform validation pending |
| 4 | Added readiness controller and security/configuration regression tests | Local tests passed |
| 5 | Ran checks and documented actual failures without disabling gates | Complete |
| 6 | Repaired frontend test providers/API fixtures, API/form types and render purity; reran lint/test/build | Complete locally: 0 lint errors, 14 tests passed, build passed |
| 7 | Deploy and execute advanced experiments | Pending |
