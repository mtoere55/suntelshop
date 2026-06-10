# Suntel Supplier Bridge - COM-TRADING Foundation

Status: SNT-COM-0 foundation
Mode: read-only preparation
Supplier: COM-TRADING
Live shop publish: disabled by default
Supplier order write: disabled by default
CidenBridge write: disabled by default

Purpose
-------
This document defines the safe foundation for integrating COM-TRADING as a supplier catalogue source for SuntelShop.
The first implementation prepares the system for supplier data without publishing products automatically and without placing supplier orders.

Security rules
--------------
Never commit API keys to GitHub.
The API key belongs only in the live server .env.

Initial flags must stay:
COM_TRADING_ENABLED=false
COM_TRADING_READ_ONLY=true
COM_TRADING_ORDER_WRITE=false
SUPPLIER_AUTO_PUBLISH=false
CIDENBRIDGE_WRITE=false

System roles
------------
COM-TRADING is the supplier catalogue and stock/price source.
SuntelShop is the public shop, admin approval layer, repair workflow, order workflow and customer-facing system.
CidenBridge is not the product import engine. CidenBridge belongs after customer/order/repair events as the identity, warranty, trust and proof layer.

Initial data flow
-----------------
COM-TRADING API -> Supplier candidate cache -> Admin review -> Manual approval -> Suntel product -> Customer order / repair record -> CidenBridge proof and warranty layer

Locked in SNT-COM-0
-------------------
No automatic public product publish.
No supplier order write.
No CidenBridge write.
No wallet write.
No blockchain write.
No API key in repository.

Candidate statuses
------------------
supplier_candidate
mapped
approved
published
rejected
price_watch

Next milestone
--------------
SNT-COM-1 may run live read-only API tests after the API key is installed in the server .env.
The first test should fetch only categories and a small product sample.
