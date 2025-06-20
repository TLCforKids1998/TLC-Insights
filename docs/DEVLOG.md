# TLC Insights – Developer Log & System Plan

## 📚 Documentation & Workflow Practices

- **Task Logging:** Every major step, decision, and code change will be documented here and in code comments.
- **Component README:** Each major component or service will have a README or docstring explaining its purpose, usage, and integration points.
- **Branching:** Use feature branches for each major task (e.g., `feature/meta-integration`, `feature/ga-integration`, `feature/firestore-sync`, etc.).
- **Commits:** Write clear, descriptive commit messages referencing the task or feature.

---

## 🏗️ System Architecture Overview

### 1. Data Sources
- **Meta Ads (Facebook/Instagram):** Campaign, ad, and conversion data via Meta Marketing API.
- **Google Analytics (GA4):** Website traffic, events, and conversions.
- **Google Tag Manager (GTM):** Custom events and tags.
- **Website Data:** User interactions, conversions, etc.

### 2. Backend/Data Pipeline
- **Server (Node.js/Express or Firebase Functions):**
  - Fetches data from Meta, GA4, and GTM APIs.
  - Normalizes and merges data.
  - Pushes data to Firestore.
- **Firestore Database:**
  - Stores raw and processed data for campaigns, website events, and conversions.

### 3. Frontend (Vue 3 + Vite)
- **Authentication:** (Optional, for internal use)
- **Dashboard:** Visualizes campaign and website data side by side.
- **Filtering & Analysis:** Filter by date, campaign, source, etc.
- **Conversion Matching Algorithm:** Connects ad data to website conversions.
- **Visualization:** Charts, tables, and insights.

---

## 📈 Progress Log

**Date: 2025-06-20**

*   **Project Initialization:**
    *   Scaffolded a new Vue 3 + Vite project named `frontend`.
    *   Initialized a git repository and pushed the initial commit to GitHub.
*   **Monorepo Restructuring:**
    *   Restructured the project into a monorepo containing `frontend`, `backend`, and `docs` directories, all managed under a single root `.git` configuration.
    *   Updated `.gitignore` to support the monorepo structure and exclude sensitive files like `serviceAccountKey.json`.
*   **Backend Scaffolding:**
    *   Created the `backend` directory with a Node.js `package.json`.
    *   Stubbed out service files for Meta, Google Analytics, and GTM integrations.
*   **Firestore Integration & Setup:**
    *   Installed `firebase-admin` SDK in the backend.
    *   Installed `firebase-tools` CLI globally.
    *   Enabled the Firestore API in the Google Cloud project.
    *   Created the Firestore database instance in production mode.
    *   Wrote and deployed secure default Firestore security rules (`firestore.rules`).
    *   Configured the project for Firebase deployments with `.firebaserc` and `firebase.json`.
    *   **Successfully tested the backend's connection to Firestore (read/write/delete).** The foundation is now verified.
*   **Meta Campaigns End-to-End Integration:**
    *   Successfully configured Google Secret Manager for secure credential storage.
    *   Set up IAM permissions for the backend service account (Secret Manager Accessor, Firestore Owner, etc.).
    *   Integrated Meta Marketing API using the Facebook Business SDK.
    *   Fetched 25 campaigns from the Meta Ad Account using a long-lived access token.
    *   Wrote all campaign data to Firestore in the `meta_campaigns` collection.
    *   Confirmed full pipeline: Meta API → Secret Manager → Backend → Firestore.
*   **Advanced Meta Data Integration & Frontend Dashboard:**
    *   Designed and implemented a hierarchical Firestore schema: campaigns → ad sets → ads → daily insights.
    *   Upgraded backend sync to fetch and store the full Meta data hierarchy.
    *   Populated Firestore with all campaign, ad set, ad, and insight data.
    *   Built a professional, expandable dashboard in Vue 3 using Element Plus.
    *   Dashboard supports drilldown from campaigns to ad sets, ads, and daily insights.
    *   Ready for further enhancements (charts, filtering, etc.).
    *   Google Analytics and GTM integration deferred for next phase.
*   **Cleanup:**
    *   Deleted the old CampaignDashboard component as it is no longer used. All campaign analytics are now handled by MetaDashboard.vue.

*   **Planned Enhancements:**
    *   Integrate Firebase Gemini to enable natural language querying and analysis of Firestore data. Users will be able to ask questions and receive insights and recommendations directly from the dashboard.
    *   Add a 'Sync Meta Data' button to the dashboard UI, allowing users to trigger a fresh sync from Meta to Firestore on demand.

## [2024-06-20] Frontend & Cloud Function Fixes
- Fixed CORS issue in syncMetaData Cloud Function by adding appropriate headers for local development.
- Registered v-chart (vue-echarts) globally in MetaDashboard.vue to resolve missing chart component warning.
- Improved data nesting visuals and ensured all Firestore data is displayed as stored, with more details at each level.

---

## 🧩 Component Breakdown & Task List (Updated)

### A. Foundational Setup (Complete)
*   **[✅] Project Scaffolding & Git Repo**
*   **[✅] Backend & Services Scaffolding**
*   **[✅] Firestore Data Model Design**
*   **[✅] Firestore Connection & Security Setup**

### B. Data Integration Services
*   **[✅] Meta Ads Integration (API, Secret Manager, Firestore sync, full hierarchy)**
*   [ ] Google Analytics Integration (deferred)
*   [ ] Google Tag Manager Integration (deferred)

### C. Data Processing & Matching
*   [ ] Data Normalization
*   [ ] Conversion Matching Algorithm

### D. Frontend (Vue)
*   **[✅] Dashboard UI (Meta Campaigns, Ad Sets, Ads, Insights)**
*   [ ] Filtering & Controls
*   [ ] Visualization (charts, tables)

### E. Documentation & DevOps
*   **[✅] DEVLOG.md**
*   [ ] README.md (update as needed)

---

## 📝 Next Steps

1. **Set up documentation structure (`docs/DEVLOG.md`, update `README.md`).**
2. **Scaffold backend integration services (Meta, GA4, GTM).**
3. **Design Firestore data model.**
4. **Build basic dashboard UI in Vue.**
5. **Iterate: Integrate, process, visualize, and document.**

---

## 🔥 Firestore Data Model (Initial Design)

### Collections
- `meta_campaigns`: Stores Meta (Facebook/Instagram) campaign data
- `ga_events`: Stores Google Analytics (GA4) event data
- `gtm_events`: Stores Google Tag Manager event data
- `conversions`: Stores matched conversion events

### Example Document Structures

#### meta_campaigns/{campaignId}
```json
{
  "id": "1234567890",
  "name": "Spring Sale",
  "status": "ACTIVE",
  "start_date": "2024-06-01",
  "end_date": "2024-06-30",
  "budget": 1000,
  // ...other Meta campaign fields
}
```

#### ga_events/{eventId}
```json
{
  "id": "evt_abc123",
  "timestamp": "2024-06-10T12:34:56Z",
  "event_name": "page_view",
  "user_id": "user_001",
  "utm_source": "facebook",
  // ...other GA4 event fields
}
```

#### gtm_events/{eventId}
```json
{
  "id": "gtm_evt_001",
  "timestamp": "2024-06-10T12:35:00Z",
  "event_type": "form_submit",
  "user_id": "user_001",
  // ...other GTM event fields
}
```

#### conversions/{conversionId}
```json
{
  "id": "conv_001",
  "timestamp": "2024-06-10T12:36:00Z",
  "user_id": "user_001",
  "source": "meta",
  "campaign_id": "1234567890",
  "ga_event_id": "evt_abc123",
  // ...other conversion fields
}
```

*This model will be refined as integration proceeds and more data fields are identified.*

---

## 🔄 Advanced Firestore Schema for Meta Data

To support full-funnel analysis and campaign performance tracking, we are upgrading the Firestore schema to a hierarchical, relational structure:

- `meta_campaigns` (collection)
  - `{campaignId}` (document)
    - name, status, objective, etc.
    - `ad_sets` (subcollection)
      - `{adSetId}` (document)
        - name, budget, status, etc.
        - `ads` (subcollection)
          - `{adId}` (document)
            - name, creative_id, etc.
            - `insights` (subcollection)
              - `{YYYY-MM-DD}` (document)
                - impressions, clicks, spend, conversions, etc.

This schema mirrors Meta's own data model and allows for efficient queries and scalable analytics.

---

## 🛠️ Next Backend Steps

1. Update the Meta backend service to fetch ad sets, ads, and daily insights for each campaign.
2. Write each entity to the correct subcollection in Firestore.
3. Ensure all writes are batched for efficiency and atomicity.
4. Update the frontend to traverse and display this nested data structure.

---

*This document will be updated continuously as the project progresses. Each new feature, integration, or architectural decision will be logged here for future reference.* 