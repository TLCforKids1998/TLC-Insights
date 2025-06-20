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

## 🧩 Component Breakdown & Task List

### A. Data Integration Services
1. **Meta Ads Integration**
   - Set up Meta App & get API credentials.
   - Build a service to fetch campaigns, ads, and conversion data.
   - Store in Firestore.

2. **Google Analytics Integration**
   - Set up GA4 API access.
   - Build a service to fetch relevant analytics data.
   - Store in Firestore.

3. **Google Tag Manager Integration**
   - Set up GTM API access.
   - Fetch custom events/tags.
   - Store in Firestore.

### B. Data Processing & Matching
4. **Data Normalization**
   - Standardize data formats across sources.

5. **Conversion Matching Algorithm**
   - Design and implement logic to connect ad clicks/impressions to website conversions (using UTM params, click IDs, etc.).

### C. Firestore Data Model
6. **Design Firestore Collections**
   - `meta_campaigns`, `ga_events`, `gtm_events`, `conversions`, etc.

### D. Frontend (Vue)
7. **Dashboard UI**
   - Campaign overview (Meta)
   - Website analytics (GA4, GTM)
   - Conversion matching results

8. **Filtering & Controls**
   - Date range, campaign, source, etc.

9. **Visualization**
   - Charts (e.g., Chart.js, ECharts)
   - Tables and export options

### E. Documentation & DevOps
10. **DEVLOG.md**
    - Log every step, issue, and solution.
11. **README.md**
    - Update with setup, architecture, and usage instructions.

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

*This document will be updated continuously as the project progresses. Each new feature, integration, or architectural decision will be logged here for future reference.* 