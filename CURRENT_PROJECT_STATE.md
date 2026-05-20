# SuntelShop Full V1 - Current Project State

## Step 74H-B - Clean Full V1 GitHub Sync Package

Date: 2026-05-20 00:12:43 UTC

Live source:
- /var/www/suntelshop

Live domain:
- https://handyreparatur.shop

Live process:
- PM2 name: suntelshop
- Port: 3015
- Server file: /var/www/suntelshop/server/index.mjs

Latest live approval:
- Step 74E7 live CidenBridgeDB pilot trust UI approved.
- Live asset confirmed:
  - /assets/index-Cw-DqL1k.js
  - /assets/index-BjfYioV4.css
- Approval backup:
  - /root/backups/suntelshop-step74e7-live-approved-20260520-001035.tar.gz

Important:
- This full-v1 source must replace the older/simple GitHub starter baseline.
- Do not overwrite live full-v1 with the old simple starter repo.
- Do not commit .env.
- Do not commit real customer orders/repairs.
- Do not commit dist or dist.before backup folders.

Next:
- Import this clean package into C:\suntelshop-git.
- Commit as full-v1 source alignment.
- Then continue Step 74F: Cidentia return/session link.


## Step 74F-B - Cidentia Return Flow Patch

Date: 2026-05-20
Repo: C:\suntelshop-git
Status: PATCHED / BUILD PENDING

Scope:
- Login with Cidentia now sends return_to, source and intent parameters.
- Return target is handyreparatur.shop with #cidenbridge anchor.
- SuntelShop shows a connection success state when cidentia=connected returns.
- No CidenBridgeDB write.
- No CidenDB touch.
- No wallet, proof or blockchain write.

Next:
- Build and smoke.
- Patch CidentiaApp LoginBridge to honor return_to after successful login.
- Commit/tag after both repos pass.


## Step 74G-B - Customer Card and Proof Preview

Date: 2026-05-20
Repo: C:\suntelshop-git
Status: PATCHED / BUILD PENDING

Scope:
- Adds Sun-TEL Customer Card Preview after Cidentia return.
- Adds Repair Proof Preview.
- Adds Warranty Proof Preview.
- Adds CidenBridgeDB-ready payload preview JSON.
- Preview appears only when cidentia=connected is present.

Safety:
- Frontend preview only.
- No CidenBridgeDB write.
- No CidenDB touch.
- No wallet write.
- No blockchain write.
- No real proof write.

Next:
- Build and smoke.
- Commit/tag if clean.
- Deploy to Hetzner after approval.
