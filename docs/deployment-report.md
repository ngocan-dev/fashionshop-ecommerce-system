# Cloud Deployment of FashionShop Using Vercel and Railway

Implementation record, 24 November 2026 (Asia/Saigon, UTC+7). Results below were observed during the deployment on this date; items still marked Pending have not been demonstrated. The original Word report is unchanged.

Revision basis: instructor feedback on the pre-report. Keep Overview, use Figure 2.1 to explain Operation, expand Architecture with additional operational services, include command-line verification and screenshots in Installation and Configuration, capture both service-side and client-side evidence for scenarios, and add section 3.2 Cost. Summary moves to 3.3. AWS is not part of the revised deployment. Lab 6 instructions have not been supplied, so the advanced scope is described as implemented rather than claimed to exceed a verified rubric.

## 1. INTRODUCTION

### 1.1 Overview

FashionShop uses Next.js, Spring Boot and MySQL. The deployment target changed from AWS EC2 and Ubuntu to Vercel and Railway because AWS account setup prevented the original route. The objective remains public application access and practical administration of configuration, networking, security and application operations. Host operating systems, ingress infrastructure and underlying servers are administered by the platforms, not the project team.

Public endpoints:

| Service | URL |
| --- | --- |
| Frontend (Vercel) | `https://fashionshop-ecommerce-system.vercel.app` |
| Backend API (Railway) | `https://fashionshop-ecommerce-system-production.up.railway.app` |

### 1.2 Architecture

The system retains three logical application tiers while delegating host administration to managed platforms. Vercel hosts the Next.js application and serves the browser interface. Railway runs the Spring Boot container and the MySQL service with persistent storage. Only the web application and backend API have public HTTPS endpoints. Database traffic stays within the Railway private network. This design separates application responsibilities; it does not by itself provide database high availability or guarantee zero downtime.

#### 1.2.1 Core application components

| Component | Target | Status |
| --- | --- | --- |
| Frontend | Next.js on Vercel (Hobby) | Deployed; production build in 51 s |
| Backend | Java 17 Docker container on Railway | Deployed; Spring Boot started in 7.7 s with profile `prod` |
| Database | MySQL 8.4.13 with persistent volume `mysql-volume` on Railway | Provisioned; schema validated by Hibernate; demo data loaded |
| Source checks | GitHub Actions (`Application checks`) | Running on every push and pull request; required for `main` |
| Monitoring | `/api/health` readiness endpoint, Railway health check, UptimeRobot | Active; controlled outage detected and alerted |

#### 1.2.2 Additional services for advanced scope

| Additional service or mechanism | Responsibility and integration | Demonstration | Status |
| --- | --- | --- | --- |
| GitHub Actions and ruleset `protect-main` | Run frontend/backend checks; block merges into `main` unless `backend` and `frontend` pass | Intentionally failing PR #10 could not be merged; production unchanged | Implemented (S07) |
| Railway Watch Paths | Redeploy the backend only when `fashionshop-backend/**` changes | Frontend/docs-only commits shown as SKIPPED, "No changes to watched files" | Implemented |
| UptimeRobot keyword monitor | Request `/api/health` every 5 minutes; e-mail on DOWN and UP | Controlled outage detected; DOWN and UP e-mails received | Implemented (S08) |
| Client-side health probe | PowerShell probe every 15 s, logged to `docs/evidence-health-probe.csv` | Precise outage window: 17:36:38 → 17:42:35 | Implemented (S08) |
| Railway CLI tunnel + `mysqldump` | Encrypted SSH tunnel to the private database; logical backup stored outside Git | Restore into an isolated database with identical counts and fingerprints | Implemented manually (S09); no schedule |
| Railway deployment rollback | Restore a previous deployment, including its build and variable snapshot | Rollback and roll-forward with `/api/health` remaining 200 | Implemented (S10) |

GitHub Actions and UptimeRobot are separate services. Private networking, environment secrets, logs, volume storage and platform HTTPS are platform capabilities, not separately implemented servers. Backups are taken on demand; no scheduled backup job or independent cloud backup storage was configured.

#### 1.2.3 Responsibility boundary

The platforms operate the underlying hosts, public ingress and platform-managed TLS. The team configures application builds, environment variables, API authorization, CORS, database access, private connections, deployment controls and recovery procedures. The report makes no claim of team-managed EC2, Ubuntu, UFW, systemd or Nginx. The only SSH use is the Railway CLI tunnel to the database, authenticated with a key registered in the Railway account.

### 1.3 Operation

The browser loads the frontend from Vercel using HTTPS. Client-side API calls go from the browser directly to the public Railway backend with a JWT when required. Spring Boot accesses MySQL through Railway private networking (`mysql.railway.internal:3306`). MySQL credentials never belong in frontend variables.

Use Figure 2.1 in section 2.1 to explain this sequence: (1) load the frontend, (2) send the API request, (3) validate authentication/authorization and query MySQL, and (4) return data to the browser. Automation, monitoring and backup arrows describe operational traffic, not the customer request path.

## 2. IMPLEMENTATION

### 2.1 Network Topology

```text
Browser --(1) HTTPS--> Vercel / Next.js
Browser --(2) HTTPS + REST/JWT--> Railway / Spring Boot
Railway / Spring Boot --(3) private JDBC (mysql.railway.internal:3306)--> Railway / MySQL + volume
Railway / MySQL --query result--> Spring Boot --(4) JSON--> Browser

GitHub --PR checks (backend, frontend) + ruleset--> main --auto deploy--> Vercel and Railway
UptimeRobot --HTTPS GET /api/health every 5 min--> Spring Boot --e-mail on DOWN/UP--> operator
Operator laptop --Railway CLI SSH tunnel--> MySQL --mysqldump--> local backups/ (outside Git)
```

Figure 2.1. FashionShop network topology on Vercel and Railway, including operational components. Replace this text drawing with the final rendered diagram before Word submission; keep the public/private boundary.

| Connection | Configuration | Exposure |
| --- | --- | --- |
| Browser to frontend | `fashionshop-ecommerce-system.vercel.app` | Public HTTPS |
| Browser to backend | `fashionshop-ecommerce-system-production.up.railway.app` | Public HTTPS |
| Platform to backend | `PORT=8081`; Tomcat listens on 8081 | Container listener |
| Backend to database | `mysql.railway.internal:3306`, database `railway` | Private network only |
| Operator to database | Railway CLI tunnel to `127.0.0.1:<local port>` | Encrypted, account-authenticated |

A public TCP proxy (`mainline.proxy.rlwy.net:44149`) was enabled temporarily for the initial MySQL Workbench connection and data import, then removed. After removal, a TCP connection to the old proxy port received no MySQL greeting, while the backend continued to return HTTP 200 over private networking (Figure 2.9a).

### 2.2 Installation

Each step reports the objective, the actual dashboard action or command, the verification and the evidence file.

#### Step 1 Prepare source code and local checks

Implemented: backend multi-stage Dockerfile with Java 17 runtime and non-root user; allowlisted Docker context; production profile; environment examples; frontend API fallback corrected from port 8080 to 8081; CI workflow.

Run from the respective component directories:

```powershell
# Backend
.\mvnw.cmd -B verify
# Frontend
npm ci
npm run lint
npm run test:run
npm run build
```

Local results on 24 November 2026: backend 135 tests, 0 failures; frontend lint 0 errors (15 warnings), 14/14 tests. Docker is not installed locally; the Java 17 image was built and started by Railway instead (Step 3).

> 📷 **Insert image:** `02-02-tool-versions.png`
>
> **Figure 2.2.** Local tool versions used for preparation: Git 2.45.1, Java 21.0.10, Node 24.14.1 and npm 11.11.0. The cloud backend runs Java 17 in the Railway container and CI uses Java 17 and Node 22.

#### Step 2 Create Railway database

1. Created project `fashionshop-sna`, environment `production`, and a MySQL service with volume `mysql-volume`. The server reports MySQL 8.4.13 and database `railway`, ready on port 3306 at 13:14:11.
2. Enabled public access temporarily (TCP proxy) and connected with MySQL Workbench (Standard TCP/IP, schema `railway`). Verified with `SELECT VERSION(), DATABASE(), CURRENT_USER(); SHOW TABLES;`.
3. Schema source: the checked-in dump `database/ecommerce_db.sql` was found to be outdated (10 of the 12 tables the entities need, and missing columns such as `users.phone_number` and most payment-gateway columns). It was not imported. Instead, the backend's first deployment ran with the temporary override `SPRING_JPA_HIBERNATE_DDL_AUTO=update`, which created all 12 tables from the JPA entities. The override was then removed so production runs with `ddl-auto=validate` (Step 3).
4. Loaded the demo dataset with MySQL Workbench (its `USE ecommerce_db;` line changed to `USE railway;`). The script ran in one transaction and ended with COMMIT: 8 users, 8 categories, 130 products, 5 carts, 7 cart items, 10 orders, 16 order items, 10 payments, 10 invoices, 9 wishlist entries.
5. Removed the public TCP proxy after the data import and verification work (Configuration Step 2).

> 📷 **Insert image:** `02-03a-mysql-service-volume.png`
>
> **Figure 2.3a.** Railway project `fashionshop-sna` (production) with the MySQL service Online and the persistent volume `mysql-volume` attached.

> 📷 **Insert image:** `02-03b-mysql-schema-verification.png`
>
> **Figure 2.3b.** MySQL Workbench connected to the Railway database: the 12 tables generated by Hibernate and row counts after loading the demo dataset (users 8, categories 8, products 130, orders 10, payments 10).

> 📷 **Insert image:** `02-03c-mysql-startup-log.png`
>
> **Figure 2.3c.** MySQL 8.4.13 startup log on Railway: the final server is ready for connections on port 3306.

#### Step 3 Deploy backend

1. Added a service from the GitHub repository in the same Railway project as MySQL (required for `${{MySQL.*}}` variable references and private networking).
2. Settings: root directory `fashionshop-backend`; builder Dockerfile; no custom start command; watch path `/fashionshop-backend/**`; health check path `/api/health` with 120 s timeout; generated public domain on port 8081.
3. The first build failed after 3 s because commits containing the Dockerfile and production profile had not yet been pushed to `main`. After pushing, the build succeeded.
4. First deployment with `SPRING_JPA_HIBERNATE_DDL_AUTO=update` created the schema; after loading data, the override was removed and the service redeployed with `validate`.
5. Deployment `c3e7a788` became Active at 15:30. Log: Java 17.0.21, `Tomcat started on port 8081`, `Started FashionShopApplication in 7.659 seconds`. Startup with `validate` confirms the database schema matches the entities.

```powershell
$u = 'https://fashionshop-ecommerce-system-production.up.railway.app'
curl.exe -i "$u/api/health"
curl.exe -i "$u/api/home"
```

Observed: both HTTP 200; `/api/health` body `{"status":"UP"}`; `/api/home` returns featured products from MySQL.

> 📷 **Insert image:** `02-04-railway-backend-deploy.png`
>
> **Figure 2.4.** Railway deployment `c3e7a788` in Active state. The deploy log shows Java 17, Tomcat on port 8081 and `Started FashionShopApplication in 7.659 seconds`, with Hibernate schema validation passing against the database.

> 📷 **Insert image:** `02-05-backend-https-curl.png`
>
> **Figure 2.5.** Client-side HTTPS verification: `/api/health` returns HTTP 200 `{"status":"UP"}` and `/api/home` returns HTTP 200 from the Railway backend.

#### Step 4 Deploy frontend

1. Imported the same repository in Vercel: root directory `fashionshop-frontend`, preset Next.js, default build settings.
2. Set `NEXT_PUBLIC_API_BASE_URL=https://fashionshop-ecommerce-system-production.up.railway.app` (no `/api` suffix) before the first build.
3. Deployed to production in 51 seconds.
4. The first browser test failed with `No 'Access-Control-Allow-Origin' header` because the backend still allowed only `http://localhost:3000`. Setting `APP_CORS_ALLOWED_ORIGINS=https://fashionshop-ecommerce-system.vercel.app` and redeploying the backend fixed it.
5. In the browser Network panel, `GET /api/products?size=20&page=0` and `GET /api/categories` to the Railway origin returned 200, and the shop page lists 130 products.

> 📷 **Insert image:** `02-06-vercel-deployment.png`
>
> **Figure 2.6.** Vercel production deployment of the frontend in Ready state.

> 📷 **Insert image:** `02-07-frontend-network-api.png`
>
> **Figure 2.7.** Production frontend on Vercel rendering the catalogue ("130 results found"); the browser Network panel shows `GET products?size=20&page=0` and `GET categories` to the Railway backend, all with status 200.

### 2.3 Configuration

Configuration screenshots hide variable values, tokens, database passwords and authorization headers.

#### Step 1 Environment variables and secrets

| Variable | Target | Value / source |
| --- | --- | --- |
| SPRING_PROFILES_ACTIVE | Backend | `prod` |
| SPRING_DATASOURCE_URL | Backend | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?serverTimezone=Asia/Ho_Chi_Minh` |
| SPRING_DATASOURCE_USERNAME | Backend | `${{MySQL.MYSQLUSER}}` (platform-provisioned `root`) |
| SPRING_DATASOURCE_PASSWORD | Backend | `${{MySQL.MYSQLPASSWORD}}` (reference, never a literal) |
| JWT_SECRET | Backend | Base64 of 32 cryptographically random bytes, generated locally without printing |
| APP_CORS_ALLOWED_ORIGINS | Backend | `https://fashionshop-ecommerce-system.vercel.app` |
| PORT | Backend | `8081` |
| NEXT_PUBLIC_API_BASE_URL | Frontend | `https://fashionshop-ecommerce-system-production.up.railway.app` |

Database credentials are Railway variable references, so a password rotation on the MySQL service reaches the backend on its next deployment without editing backend variables. The MySQL root password was changed after the bootstrap phase, during which it had been exposed in screenshots. Previously committed credentials remain in Git history and are not used in the cloud deployment.

> 📷 **Insert image:** `02-08a-railway-backend-variables.png`
>
> **Figure 2.8a.** Railway backend service variables (7) with all values masked.

> 📷 **Insert image:** `02-08b-vercel-env-variable.png`
>
> **Figure 2.8b.** Vercel environment variable `NEXT_PUBLIC_API_BASE_URL` pointing to the Railway backend origin.

> 📷 **Insert image:** `02-08c-prod-profile-log.png`
>
> **Figure 2.8c.** Backend startup log confirming that the `prod` profile is active.

#### Step 2 Database access and stock behavior

Production uses `ddl-auto=validate`, SQL logging disabled, a maximum pool of five connections and a five-second acquisition timeout. Automatic stock replenishment is disabled (`app.demo.initialize-stock=false`).

The backend uses the platform-provisioned `root` account. A dedicated least-privilege application user (SELECT, INSERT, UPDATE, DELETE on `railway` only) was not created and is recommended future work.

> 📷 **Insert image:** `02-09a-mysql-private-networking.png`
>
> **Figure 2.9a.** Railway MySQL networking after bootstrap: public access removed ("Add Public Access" available again); only private networking `mysql.railway.internal` remains, while the backend continues to serve requests.

> 📷 **Insert image:** `02-09b-stock-after-redeploys.png`
>
> **Figure 2.9b.** Stock for products 1001–1003 queried at 16:47, after several backend redeploys, still equals the seeded values (120, 90, 70), showing that startup does not replenish stock.

#### Step 3 CORS and authorization

Spring Security is the single CORS source, reading exact origins from configuration.

```powershell
$b = 'https://fashionshop-ecommerce-system-production.up.railway.app'
curl.exe -i -X OPTIONS "$b/api/products" -H "Origin: https://fashionshop-ecommerce-system.vercel.app" -H "Access-Control-Request-Method: GET"
curl.exe -i -X OPTIONS "$b/api/home" -H "Origin: https://evil.example.com" -H "Access-Control-Request-Method: GET"
```

Observed: allowed origin → 200 with `access-control-allow-origin: https://fashionshop-ecommerce-system.vercel.app`; unrelated origin → 403 with no allow header.

Authorization checks against production without a token: `GET /api/me`, `/api/cart`, `/api/orders`, `/api/admin/dashboard`, `/api/admin/users`, `/api/staff/orders` all return 401. Product and category write endpoints are protected by `@PreAuthorize("hasAnyRole('STAFF','ADMIN')")`; an unauthenticated `POST /api/products` returns 400 because request validation runs before method security, not because the request is accepted. Protected frontend routes (`/cart`, `/orders`, `/admin/dashboard`, `/staff/orders`) redirect (307) to sign-in.

> 📷 **Insert image:** `02-10-cors-preflight.png`
>
> **Figure 2.10.** CORS preflight against production at 11:35:46 UTC: the Vercel origin receives HTTP 200 with `access-control-allow-origin: https://fashionshop-ecommerce-system.vercel.app`; an unrelated origin receives HTTP 403 with no allow header.

#### Step 4 CI/CD

The workflow `.github/workflows/ci.yml` runs `backend` (`mvnw -B verify`, Java 17) and `frontend` (lint, tests, build, Node 22) on every push and pull request, with read-only repository permission and no deployment secrets.

Release controls:

1. Ruleset `protect-main` (verified through the GitHub API): enforcement active; target default branch `main`; bypass list empty; rules `deletion`, `non_fast_forward`, `pull_request` (0 required approvals), `required_status_checks` = `backend`, `frontend`.
2. Railway and Vercel deploy production only from `main`; pull requests get Vercel preview deployments only.
3. Railway watch path `/fashionshop-backend/**`: commits that do not touch the backend are SKIPPED.
4. Railway "Wait for CI" is enabled on the backend service, so a push to `main` deploys only after the GitHub Actions checks complete successfully (Figure 2.11a).

Experiments:

- **Failed candidate (PR #10)**: added a deliberately failing test `CiGateDemoTest`. `backend` failed (136 tests, 1 failure: `expected: <1> but was: <2>`), `frontend` passed, merge state BLOCKED. `main` and production stayed on merge commit `59b147e`; `/api/health` remained UP. The PR was closed unmerged and the branch deleted.
- **Successful change (PR #9)**: fixed broken storefront links found in an end-to-end check (`/shop?collection=archive`, `/faq`, invalid footer anchors) and an invisible CTA label. Checks passed and it was merged (`59b147e`). The first `backend` run on `main` failed because the runner could not download Maven (`wget: Failed to fetch apache-maven-3.9.14-bin.zip`); re-running the failed job passed. Vercel deployed the fix; Railway marked the commit SKIPPED.

> 📷 **Insert image:** `02-11a-railway-wait-for-ci.png`
>
> **Figure 2.11a.** Railway backend source settings: root directory `/fashionshop-backend`, production branch `main` with auto deploy, and "Wait for CI" enabled.

> 📷 **Insert image:** `02-11b-github-ruleset-protect-main.png`
>
> **Figure 2.11b.** GitHub ruleset `protect-main`: enforcement Active, bypass list empty, target the default branch `main`.

> 📷 **Insert image:** `02-11b2-github-ruleset-rules.png`
>
> **Figure 2.11c.** Rules of `protect-main`: restrict deletions, require a pull request before merging, require status checks `backend` and `frontend` (GitHub Actions), and block force pushes.

> 📷 **Insert image:** `02-11c-pr10-ci-failed.png`
>
> **Figure 2.11d.** Failed candidate PR #10 (`ci-gate-demo`, 2c3185f): the `backend` check fails on both push and pull_request runs while `frontend` passes. Its merge state was BLOCKED (verified through the GitHub API) and the PR was closed unmerged.

> 📷 **Insert image:** `02-11d-vercel-production-unchanged.png`
>
> **Figure 2.11e.** Vercel deployment history: the failing branch `ci-gate-demo` produced only a Preview deployment, while every Production deployment comes from `main` after a passing pull request.

> 📷 **Insert image:** `02-11d2-vercel-ci-gate-demo-preview.png`
>
> **Figure 2.11f.** Detail of the `ci-gate-demo` deployment: environment Preview with a branch-specific URL; production domain assignment skipped.

> 📷 **Insert image:** `02-11e-railway-watch-paths-skipped.png`
>
> **Figure 2.11g.** Railway watch paths (`/fashionshop-backend/**`): documentation-only merges (PR #11, PR #12) are SKIPPED with "No changes to watched files"; the active backend deployment is unchanged.

#### Step 5 Health checks and monitoring

`GET /api/health` is public and checks the database with `SELECT 1`. It returns only UP (200) or DOWN (503), never connection details.

Configured monitoring:

- Railway health check: path `/api/health`, timeout 120 s; a deployment becomes Active only after this returns 200.
- UptimeRobot keyword monitor "FashionShop API health": URL `/api/health`, incident when `"status":"UP"` is absent, interval 5 minutes, e-mail alerts.

Controlled outage (24 November 2026):

| Event | Time (UTC+7) | Source |
| --- | --- | --- |
| Last healthy response | 17:36:23 | Client probe: 200 `{"status":"UP"}` |
| Active backend deployment removed on Railway | ~17:36:30 | Operator action |
| First failed response | 17:36:38 | Client probe: 404 `Application not found` (Railway edge) |
| UptimeRobot DOWN + e-mail | See Figure 2.12c–d | UptimeRobot |
| Deployment restored by rollback | ~17:42 | Operator action |
| First healthy response | 17:42:35 | Client probe: 200 |
| UptimeRobot UP + e-mail | See Figure 2.12e–f | UptimeRobot |

Observed outage from the client: about 5 min 57 s (23 consecutive failed probes; full log in `docs/evidence-health-probe.csv`). Because UptimeRobot checks every 5 minutes, its detection and recovery times lag the real transitions by up to one interval; a shorter interval would reduce detection time. A "TEST" e-mail sent from the UptimeRobot notification test before the outage is not used as incident evidence.

> 📷 **Insert image:** `02-12a-railway-healthcheck.png`
>
> **Figure 2.12a.** Railway deploy settings: health check path `/api/health` and timeout 120 s.

> 📷 **Insert image:** `02-12b-uptimerobot-monitor.png`
>
> **Figure 2.12b.** UptimeRobot keyword monitor "FashionShop API health" in Up state, checking `/api/health` every 5 minutes for the absence of `"status":"UP"`.

> 📷 **Insert image:** `02-12c-uptimerobot-down.png`
>
> **Figure 2.12c.** UptimeRobot reports the monitor Down during the controlled outage.

> 📷 **Insert image:** `02-12d-alert-email-down.png`
>
> **Figure 2.12d.** DOWN alert e-mail from UptimeRobot for "FashionShop API health" (e-mail address redacted).

> 📷 **Insert image:** `02-12e-uptimerobot-recovered.png`
>
> **Figure 2.12e.** Monitor back Up after the rollback, with the incident recorded in the history.

> 📷 **Insert image:** `02-12f-alert-email-up.png`
>
> **Figure 2.12f.** UP (recovery) alert e-mail from UptimeRobot.

> 📷 **Insert image:** `02-12g-client-probe-log.png`
>
> **Figure 2.12g.** Client probe log (15-second interval): 200 until 17:36:23, 404 `Application not found` from 17:36:38 to 17:42:19, and 200 again from 17:42:35 (about 6 minutes observed outage).

#### Step 6 Backup and recovery

Database backup (manual, on demand):

1. Opened an encrypted tunnel with Railway CLI 5.75.0: `railway login`, `railway link` (project `fashionshop-sna`, environment `production`), `railway connect MySQL --tunnel-only`. An SSH key (`railway-tunnel`, ED25519) was generated and registered with Railway. The tunnel listened on `127.0.0.1:52191`; no public database access was opened.
2. Logical backup with `mysqldump` 8.0.45 against MySQL 8.4.13, password entered at the prompt:

```powershell
$f = "backups\railway-$(Get-Date -Format yyyyMMdd-HHmm).sql"
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -h 127.0.0.1 -P <tunnel-port> -u root -p `
  --single-transaction --routines --triggers --no-tablespaces --set-gtid-purged=OFF `
  --column-statistics=0 --default-character-set=utf8mb4 "--result-file=$f" railway
(Select-String -Path $f -Pattern '^CREATE TABLE').Count
Select-String -Path $f -Pattern 'Dump completed' -Quiet
Get-FileHash $f -Algorithm SHA256
```

Result: `backups/railway-20261124-1802.sql`, 44,805 bytes, 12 tables, ends with `Dump completed`; SHA-256 recorded in Figure 3.9b. A first attempt was interrupted and produced an incomplete file (6 tables, no completion marker); it was detected by these checks and deleted. `backups/` is gitignored because the dump contains user e-mails and password hashes.

3. Restore into an isolated database on the operator's local MySQL Server 8.0, never on production:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -h 127.0.0.1 -P 3306 -u root -p --default-character-set=utf8mb4 -e "CREATE DATABASE fashionshop_restore_test CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci; USE fashionshop_restore_test; SOURCE <dump-path>; SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'fashionshop_restore_test';"
```

Result: 12 tables restored, exit code 0, under 10 s including password entry.

4. Verification with `database/verify-restore.sql` on both databases. Row counts and CRC32 fingerprints were identical:

| Table | Rows | Fingerprint |
| --- | --- | --- |
| products | 130 | 258943919302 |
| users | 9 | 16776111648 |
| orders | 10 | 29825866693 |
| order_items | 16 | 36973751743 |
| payments | 10 | 13983244810 |
| carts / cart_items | 6 / 8 | not fingerprinted |
| categories / invoices / wishlists | 8 / 10 / 10 | not fingerprinted |
| banners / blacklisted_tokens | 0 / 0 | not fingerprinted |

The users, carts and wishlists counts are higher than the initial seed because of activity on the live site; the backup reflects the actual production state at 18:02.

Limits: backups are manual, so the potential data-loss window equals the time since the last backup. No scheduler, retention policy or independent cloud storage was configured. Railway's built-in volume backups were not used in this exercise.

Application rollback (Railway, around 17:25): restored the previous deployment from history. Railway's confirmation states that it restores "both the build and variables". The rolled-back deployment became Active, `/api/health` returned 200 at 17:25:00 and CORS for the Vercel origin was still correct, so users saw no interruption. The latest deployment was then rolled forward with API, CORS and frontend all returning 200. All deployments involved came from the same commit and differed only in variables, so the rollback demonstrates the mechanism rather than reverting a code defect. Application rollback does not restore schema or data; database recovery is the separate restore above.

Figure references: backup/restore in Figures 3.9a–d; rollback in Figures 3.10a–e.

## 3. RESULTS

### 3.1 Deployment and Testing Scenarios

Local verification on 24 November 2026 used Windows, Java 21.0.10 and Node 24.14.1. CI and Railway use Java 17; CI uses Node 22.

| Scenario | Actual result | Evidence |
| --- | --- | --- |
| Backend verify/package | PASS: 135 tests locally; CI `backend` passes on `main` | Local log; GitHub Actions |
| Frontend lint / tests / build | PASS: 0 errors (15 warnings), 14/14 tests; CI `frontend` passes | Local log; GitHub Actions |
| Java 17 container build and startup | PASS on Railway (Dockerfile build, Java 17.0.21) | Figure 2.4 |
| MySQL schema validation | PASS: production starts with `ddl-auto=validate` | Figure 2.4 |
| Public HTTPS frontend and backend | PASS | Figures 2.5, 2.7 |
| Frontend ↔ backend API contract | PASS: every API path called by the frontend (about 60) maps to a backend endpoint | End-to-end code check |
| CI gate and remote workflow | PASS | Figure 2.11 |
| Monitoring and alerting | PASS | Figure 2.12 |
| Backup restore | PASS | Figures 3.9a–d |
| Rollback | PASS | Figures 3.10a–e |
| Load / performance | NOT RUN | No performance claim made |

#### Follow-up frontend verification on 24 November 2026

Step 1: repaired the test environment. Each test render receives a fresh QueryClientProvider, with retries disabled. The product listing test mocks API service responses and waits for the asynchronous result. Authentication validation tests use the actual query provider.

Step 2: resolved lint errors without disabling rules. Added explicit API response types for orders, products and account lists, typed wishlist cache entries, separated Zod form input/output types and converted fallback category IDs to numbers. Replaced empty interfaces with type aliases and escaped JSX text. Removed unused imports and stabilized memo dependencies. Checkout payment selection now uses useWatch.

Step 3: removed render-time Date.now calls from checkout confirmation. Session storage is read through useSyncExternalStore with a stable string snapshot and server snapshot. Missing order numbers display Unavailable instead of an invented identifier. Two regression tests cover a stored order and malformed stored JSON. Payment integration remains simulated.

Step 4: verified locally with `npm run lint`, `npm run test:run` and `npm run build`: lint exit 0 (0 errors, 15 warnings); tests 14/14 in 10 files; build exit 0. No ESLint rule, test assertion or CI gate was disabled.

> 📷 **Insert image:** `03-00a2-local-lint.png`
>
> **Figure 3.0a.** Local ESLint result: 15 problems, 0 errors and 15 non-blocking warnings.

> 📷 **Insert image:** `03-00a-local-test.png`
>
> **Figure 3.0b.** Local Vitest result: 10 test files and 14 tests passed.

> 📷 **Insert image:** `03-00b-local-build.png`
>
> **Figure 3.0c.** Local production build with Next.js 16.4.6: compiled successfully, TypeScript check passed and all 33 static pages generated; the only warning is the existing middleware-to-proxy deprecation.

#### Cloud scenario evidence from two viewpoints

On Vercel/Railway, the "server viewpoint" is the relevant deployment, log, metric, database query or configuration; the client viewpoint is the browser or client terminal response. Times are UTC+7 unless a log shows UTC.

| Scenario | Objective / expected result | Server or service-side evidence | Client-side evidence | Cloud result |
| --- | --- | --- | --- | --- |
| S01 Service readiness | Deployment starts and database readiness succeeds | Deployment `c3e7a788` Active; health check passed (Fig. 2.4) | `/api/health` 200 UP (Fig. 2.5) | PASS |
| S02 Web accessibility | Public HTTPS frontend loads | Vercel production deployment Ready (Fig. 2.6) | Homepage and `/products` 200; catalogue rendered (Fig. 2.7) | PASS |
| S03 Backend connectivity | Frontend API request succeeds | Backend reachable; data served from MySQL | DevTools: `GET /api/products?size=20&page=0` 200 (Fig. 2.7) | PASS |
| S04 Database persistence | Data survives backend redeploys | Data unchanged across several backend redeploys and rollbacks; backup at 18:02 contains the seed plus site activity | Catalogue unchanged after redeploys | PARTIAL: no dedicated before/after order capture |
| S05 Role functionality | CUSTOMER, STAFF and ADMIN follow allowed workflows | Unauthenticated access to protected endpoints returns 401 | Manual role walkthrough | PARTIAL: role walkthrough pending capture |
| S06 Origin control | Allowed origin succeeds; unrelated origin rejected | `APP_CORS_ALLOWED_ORIGINS` set to the Vercel origin | Preflight: Vercel 200 with allow header; other origin 403 | PASS |
| S07 Release gate | Failed candidate is not released | PR #10: `backend` failed, merge BLOCKED (Fig. 2.11c–d) | Production unchanged, `/api/health` UP (Fig. 2.11e–f) | PASS |
| S08 Monitoring and recovery | Controlled outage detected and recovery observed | Deployment removed and restored (Railway) | UptimeRobot DOWN/UP and e-mails; probe 200 → 404 → 200 (Fig. 2.12) | PASS |
| S09 Backup restore | Isolated restored data matches the backup | `mysqldump` via tunnel, 12 tables, SHA-256 (Fig. 3.9a–b) | Restored DB has identical counts and fingerprints (Fig. 3.9c–d) | PASS |
| S10 Application rollback | Previous deployment restored, then roll-forward | Deployment history before/after rollback (Fig. 3.10a–c, e) | `/api/health` 200 after rollback (Fig. 3.10d) | PASS |

> 📷 **Insert image:** `03-09a-railway-tunnel.png`
>
> **Figure 3.9a.** Railway CLI encrypted tunnel to the private MySQL service on `127.0.0.1:52191`, after registering the `railway-tunnel` SSH key; no public database access is opened. Password and URL redacted.

> 📷 **Insert image:** `03-09b-backup-mysqldump.png`
>
> **Figure 3.9b.** `mysqldump --single-transaction` through the tunnel: backup file `railway-20261124-1802.sql`, 12 tables, completion marker present, exit code 0 and SHA-256 checksum.

> 📷 **Insert image:** `03-09c-restore-local.png`
>
> **Figure 3.9c.** Restore into the isolated local database `fashionshop_restore_test`: 12 tables restored, exit code 0.

> 📷 **Insert image:** `03-09d-verify-source-vs-restore.png`
>
> **Figure 3.9d.** `verify-restore.sql` run on the Railway source `railway` (left, via tunnel) and on `fashionshop_restore_test` (right): row counts for all 12 tables and CRC32 fingerprints for products, users, orders, order_items and payments are identical.

> 📷 **Insert image:** `03-10a-railway-before-rollback.png`
>
> **Figure 3.10a.** Railway backend deployments before rollback: the current deployment is Active, with previous deployments in history.

> 📷 **Insert image:** `03-10b-railway-rollback-confirm.png`
>
> **Figure 3.10b.** Railway rollback confirmation: reverting restores both the build and the variables of the selected deployment.

> 📷 **Insert image:** `03-10c-railway-after-rollback.png`
>
> **Figure 3.10c.** After rollback: the previous deployment is Active and the former active deployment is being removed.

> 📷 **Insert image:** `03-10d-railway-rollback-health.png`
>
> **Figure 3.10d.** Client check after rollback: `/api/health` returns HTTP 200 `{"status":"UP"}` at 10:25:00 GMT (17:25 local).

> 📷 **Insert image:** `03-10e-railway-roll-forward.png`
>
> **Figure 3.10e.** Roll-forward: the latest deployment is Active again and the rolled-back deployment is being removed.

### 3.2 Cost

#### 3.2.1 Cost components

| Component | Plan observed | Evidence source |
| --- | --- | --- |
| Vercel frontend | Hobby (free) | Vercel team badge "Hobby" |
| Railway backend + MySQL | Trial credit; dashboard showed "30 days or $4.97 left" at 17:52 | Railway project header / usage page |
| GitHub Actions | Public repository | Account Actions usage |
| UptimeRobot | Free plan (5-minute interval) | UptimeRobot account |
| Backup storage | Local disk only; no cloud storage cost | — |
| Custom domain | None; platform domains only | — |

#### 3.2.2 Demo-period cost and monthly estimate

| Measurement | Actual value | Source |
| --- | --- | --- |
| Deployment observation period | 24 November 2026, from about 13:14 (MySQL ready) | Deployment timestamps |
| Resource/plan charges before credits | Pending | Railway billing breakdown |
| Trial credits applied | Pending (balance $4.97 remaining at 17:52) | Railway billing |
| Actual amount payable | Pending | Invoice or billing statement |
| Estimated monthly cost without trial credits | Pending | Measured daily usage plus plan rules |

Free credits reduce cash payment; they do not mean the resources cost nothing. Do not copy AWS prices or assume older quoted platform prices still apply.

> 📷 **Insert image:** `03-11-railway-usage.png` [Pending capture]
>
> **Figure 3.11.** Railway usage and remaining trial credit for project `fashionshop-sna` during the observation period (payment details hidden).

> 📷 **Insert image:** `03-12-vercel-usage.png` [Pending capture]
>
> **Figure 3.12.** Vercel Hobby plan usage for the frontend project (payment details hidden).

#### 3.2.3 Cost control

Restore resources were created only on local hardware. The temporary public database proxy was removed after use. UptimeRobot requests every 5 minutes keep the backend awake, which affects both availability measurements and usage. After evidence is saved: drop `fashionshop_restore_test`, delete the `railway-tunnel` SSH key from Railway if no longer needed, and pause the UptimeRobot monitor.

### 3.3 Summary

FashionShop runs publicly on Vercel (frontend) and Railway (Spring Boot and MySQL with a persistent volume), with the database reachable only through private networking. Production starts with Hibernate schema validation and serves the demo catalogue over HTTPS with exact-origin CORS and JWT-protected endpoints. The advanced scope was demonstrated: a ruleset blocks merges unless CI passes (PR #10), UptimeRobot detected a controlled six-minute outage and sent DOWN/UP e-mails, a backup taken through an encrypted tunnel restored into an isolated database with identical data, and a Railway rollback and roll-forward kept the API healthy. Remaining gaps: a dedicated least-privilege database user, scheduled backups with off-platform storage, captured role walkthroughs (S05), and billing figures. Payment gateways remain mocks; the report describes payments as simulated.

### Implementation log

| Step | Work completed | Status |
| --- | --- | --- |
| 1 | Inspected repository, frontend instructions and deployment settings | Complete |
| 2 | Externalized secrets, added prod profile/PORT, unified CORS, disabled implicit stock mutation | Complete |
| 3 | Added non-root Dockerfile, environment examples and CI workflow | Complete; validated on Railway and GitHub Actions |
| 4 | Added readiness controller and security/configuration regression tests | Complete |
| 5 | Ran checks and documented failures without disabling gates | Complete |
| 6 | Repaired frontend tests, types and render purity | Complete |
| 7 | Provisioned MySQL, created schema, loaded demo data, deployed backend and frontend | Complete |
| 8 | Fixed CORS for the Vercel origin; removed public database proxy | Complete |
| 9 | End-to-end check; fixed broken storefront links (PR #9) | Complete |
| 10 | Ruleset `protect-main`, failing-candidate experiment (PR #10), Railway rollback | Complete |
| 11 | UptimeRobot monitor, controlled outage, client probe log | Complete |
| 12 | Backup via Railway CLI tunnel, isolated restore, verification script (PR #11) | Complete |
