# TLC Insights Backend

This backend service handles data integration, processing, and synchronization for the TLC Insights internal analytics platform.

## Purpose
- Fetch and normalize data from Meta Ads, Google Analytics, and Google Tag Manager APIs.
- Process and match conversion data.
- Store and retrieve data from Firestore for use in the frontend dashboard.

## Structure
- `services/meta.js` – Meta Ads API integration (stub)
- `services/ga.js` – Google Analytics API integration (stub)
- `services/gtm.js` – Google Tag Manager API integration (stub)
- `index.js` – Entry point for backend logic

## Next Steps
1. Implement service stubs for Meta, GA, and GTM integrations.
2. Set up Firestore connection and data model.
3. Expose REST endpoints or functions for frontend consumption.

---

*See `../docs/DEVLOG.md` for the full project plan and ongoing log.* 