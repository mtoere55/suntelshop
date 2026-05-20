# SuntelShop Full V1

SuntelShop Full V1 is the live source baseline for handyreparatur.shop.

## Live

- Domain: https://handyreparatur.shop
- Server path: /var/www/suntelshop
- PM2 process: suntelshop
- Port: 3015

## Current direction

This repository is now aligned with the live Full V1 source, not the older simple starter baseline.

The live shop includes:

- product catalogue
- repair flow
- service form
- public shop pages
- generated product visuals
- CidenBridgeDB pilot trust UI
- Cidentia login entry point

## Safety

Do not commit:

- .env
- node_modules
- dist
- real customer orders
- real repair/customer records

The files data/orders.json and data/repairs.json are placeholders in this repository.

## Latest locked milestone

Step 74E7 approved the live CidenBridgeDB pilot trust UI on handyreparatur.shop.

Step 74H-C imports the clean Full V1 source back into GitHub so the repository matches the real live system.
