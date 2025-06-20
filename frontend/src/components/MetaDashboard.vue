<template>
  <section>
    <el-card class="dashboard-card">
      <div class="dashboard-header">
        <h1>Meta Campaigns Dashboard</h1>
        <el-breadcrumb separator="/" class="breadcrumbs">
          <el-breadcrumb-item @click="resetToCampaigns" style="cursor:pointer">Campaigns</el-breadcrumb-item>
          <el-breadcrumb-item v-if="selectedCampaign" @click="resetToAdSets" style="cursor:pointer">{{ selectedCampaign.name }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="selectedAdSet" @click="resetToAds" style="cursor:pointer">{{ selectedAdSet.name }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="selectedAd">{{ selectedAd.name }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="primary" :loading="syncing" @click="syncMetaData">Sync Meta Data</el-button>
      </div>
      <el-switch v-model="showRaw" active-text="Show Raw Data" inactive-text="Hide Raw Data" class="raw-toggle" />
      <el-alert v-if="syncMessage" :title="syncMessage" :type="syncSuccess ? 'success' : 'error'" show-icon class="sync-alert" @close="syncMessage = ''" />
      <div v-if="!selectedCampaign">
        <h2>Campaigns</h2>
        <div class="kpi-row">
          <div class="kpi-card" v-for="kpi in campaignKpis" :key="kpi.label">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
          </div>
        </div>
        <el-table :data="filteredCampaigns" v-loading="loading" style="width:100%" @row-click="onSelectCampaign">
          <el-table-column v-for="col in campaignColumns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :min-width="col.minWidth" />
        </el-table>
        <div v-if="showRaw && filteredCampaigns.length" class="raw-json"><pre>{{ filteredCampaigns }}</pre></div>
        <div v-if="!filteredCampaigns.length && !loading" class="no-data">No campaigns found.</div>
      </div>
      <div v-else-if="selectedCampaign && !selectedAdSet">
        <el-button @click="resetToCampaigns" class="nav-btn">Back</el-button>
        <h2>Ad Sets for: {{ selectedCampaign.name }}</h2>
        <div class="kpi-row">
          <div class="kpi-card" v-for="kpi in adSetKpis" :key="kpi.label">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
          </div>
        </div>
        <el-descriptions :title="selectedCampaign.name + ' Details'" :column="2" border>
          <el-descriptions-item v-for="(value, key) in selectedCampaign" :key="key" :label="key">{{ value }}</el-descriptions-item>
        </el-descriptions>
        <el-table :data="adSets[selectedCampaign.id] || []" v-loading="loadingAdSets" style="width:100%" @row-click="onSelectAdSet">
          <el-table-column v-for="col in adSetColumns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :min-width="col.minWidth" />
        </el-table>
        <div v-if="showRaw && (adSets[selectedCampaign.id] || []).length" class="raw-json"><pre>{{ adSets[selectedCampaign.id] }}</pre></div>
        <div v-if="!(adSets[selectedCampaign.id] && adSets[selectedCampaign.id].length) && !loadingAdSets" class="no-data">No ad sets found for this campaign.</div>
      </div>
      <div v-else-if="selectedAdSet && !selectedAd">
        <el-button @click="resetToAdSets" class="nav-btn">Back</el-button>
        <h2>Ads for: {{ selectedAdSet.name }}</h2>
        <div class="kpi-row">
          <div class="kpi-card" v-for="kpi in adKpis" :key="kpi.label">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
          </div>
        </div>
        <el-descriptions :title="selectedAdSet.name + ' Details'" :column="2" border>
          <el-descriptions-item v-for="(value, key) in selectedAdSet" :key="key" :label="key">{{ value }}</el-descriptions-item>
        </el-descriptions>
        <el-table :data="ads[selectedAdSet.id] || []" v-loading="loadingAds" style="width:100%" @row-click="onSelectAd">
          <el-table-column v-for="col in adColumns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :min-width="col.minWidth" />
        </el-table>
        <div v-if="showRaw && (ads[selectedAdSet.id] || []).length" class="raw-json"><pre>{{ ads[selectedAdSet.id] }}</pre></div>
        <div v-if="!(ads[selectedAdSet.id] && ads[selectedAdSet.id].length) && !loadingAds" class="no-data">No ads found for this ad set.</div>
      </div>
      <div v-else-if="selectedAd">
        <el-button @click="resetToAds" class="nav-btn">Back</el-button>
        <h2>Insights for: {{ selectedAd.name }}</h2>
        <div class="kpi-row">
          <div class="kpi-card" v-for="kpi in insightKpis" :key="kpi.label">
            <div class="kpi-label">{{ kpi.label }}</div>
            <div class="kpi-value">{{ kpi.value }}</div>
          </div>
        </div>
        <el-descriptions :title="selectedAd.name + ' Details'" :column="2" border>
          <el-descriptions-item v-for="(value, key) in selectedAd" :key="key" :label="key">{{ value }}</el-descriptions-item>
        </el-descriptions>
        <el-table :data="insights[selectedAd.id] || []" v-loading="loadingInsights" style="width:100%">
          <el-table-column v-for="col in insightColumns" :key="col.prop" :prop="col.prop" :label="col.label" :width="col.width" :min-width="col.minWidth" />
        </el-table>
        <div v-if="showRaw && (insights[selectedAd.id] || []).length" class="raw-json"><pre>{{ insights[selectedAd.id] }}</pre></div>
        <div v-if="!(insights[selectedAd.id] && insights[selectedAd.id].length) && !loadingInsights" class="no-data">No insights found for this ad.</div>
        <div v-if="(insights[selectedAd.id] || []).length" class="insight-chart">
          <v-chart :option="getChartOption(insights[selectedAd.id])" autoresize style="height: 300px; width: 100%;" />
        </div>
      </div>
    </el-card>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import axios from 'axios';
import VueECharts from 'vue-echarts';
import { getCurrentInstance } from 'vue';
const app = getCurrentInstance()?.appContext.app;
if (app && !app._context.components['v-chart']) {
  app.component('v-chart', VueECharts);
}

const campaigns = ref([]);
const adSets = ref({});
const ads = ref({});
const insights = ref({});
const loading = ref(true);
const loadingAdSets = ref(false);
const loadingAds = ref(false);
const loadingInsights = ref(false);
const filters = ref({ name: '', status: '', objective: '' });
const syncing = ref(false);
const syncMessage = ref('');
const syncSuccess = ref(true);
const selectedCampaign = ref(null);
const selectedAdSet = ref(null);
const selectedAd = ref(null);
const showRaw = ref(false);

const uniqueObjectives = computed(() => {
  const set = new Set(campaigns.value.map(c => c.objective).filter(Boolean));
  return Array.from(set);
});

const filteredCampaigns = computed(() => {
  return campaigns.value.filter(c => {
    const nameMatch = !filters.value.name || c.name?.toLowerCase().includes(filters.value.name.toLowerCase());
    const statusMatch = !filters.value.status || c.status === filters.value.status;
    const objectiveMatch = !filters.value.objective || c.objective === filters.value.objective;
    return nameMatch && statusMatch && objectiveMatch;
  });
});

function resetToCampaigns() {
  selectedCampaign.value = null;
  selectedAdSet.value = null;
  selectedAd.value = null;
}
function resetToAdSets() {
  selectedAdSet.value = null;
  selectedAd.value = null;
}
function resetToAds() {
  selectedAd.value = null;
}

async function syncMetaData() {
  syncing.value = true;
  syncMessage.value = '';
  try {
    const res = await axios.post('https://us-central1-tlc-insights.cloudfunctions.net/syncMetaData');
    syncMessage.value = res.data.message || 'Meta data sync complete.';
    syncSuccess.value = true;
    await loadCampaigns();
  } catch (e) {
    syncMessage.value = e.response?.data?.error || e.message || 'Sync failed.';
    syncSuccess.value = false;
  } finally {
    syncing.value = false;
  }
}

async function loadCampaigns() {
  loading.value = true;
  try {
    const querySnapshot = await getDocs(collection(db, 'meta_campaigns'));
    campaigns.value = querySnapshot.docs.map(doc => doc.data());
  } finally {
    loading.value = false;
  }
}

async function onSelectCampaign(row) {
  selectedCampaign.value = row;
  selectedAdSet.value = null;
  selectedAd.value = null;
  loadingAdSets.value = true;
  try {
    const adSetsSnap = await getDocs(collection(db, 'meta_campaigns', row.id, 'ad_sets'));
    adSets.value[row.id] = adSetsSnap.docs.map(doc => doc.data());
  } finally {
    loadingAdSets.value = false;
  }
}

async function onSelectAdSet(row) {
  selectedAdSet.value = row;
  selectedAd.value = null;
  loadingAds.value = true;
  try {
    const adsSnap = await getDocs(collection(db, 'meta_campaigns', selectedCampaign.value.id, 'ad_sets', row.id, 'ads'));
    ads.value[row.id] = adsSnap.docs.map(doc => doc.data());
  } finally {
    loadingAds.value = false;
  }
}

async function onSelectAd(row) {
  selectedAd.value = row;
  loadingInsights.value = true;
  try {
    const insightsSnap = await getDocs(collection(db, 'meta_campaigns', selectedCampaign.value.id, 'ad_sets', selectedAdSet.value.id, 'ads', row.id, 'insights'));
    insights.value[row.id] = insightsSnap.docs.map(doc => doc.data());
  } finally {
    loadingInsights.value = false;
  }
}

// Add dynamic columns for all fields
const campaignColumns = computed(() => Object.keys((filteredCampaigns.value[0] || {})).map(key => ({ prop: key, label: key.charAt(0).toUpperCase() + key.slice(1) })));
const adSetColumns = computed(() => Object.keys((adSets[selectedCampaign.value?.id]?.[0] || {})).map(key => ({ prop: key, label: key.charAt(0).toUpperCase() + key.slice(1) })));
const adColumns = computed(() => Object.keys((ads[selectedAdSet.value?.id]?.[0] || {})).map(key => ({ prop: key, label: key.charAt(0).toUpperCase() + key.slice(1) })));
const insightColumns = computed(() => Object.keys((insights[selectedAd.value?.id]?.[0] || {})).map(key => ({ prop: key, label: key.charAt(0).toUpperCase() + key.slice(1) })));

// KPI helpers
const campaignKpis = computed(() => [
  { label: 'Total Campaigns', value: filteredCampaigns.value.length },
  { label: 'Active', value: filteredCampaigns.value.filter(c => c.status === 'ACTIVE').length },
]);
const adSetKpis = computed(() => {
  const sets = adSets[selectedCampaign.value?.id] || [];
  return [
    { label: 'Total Ad Sets', value: sets.length },
    { label: 'Active', value: sets.filter(a => a.status === 'ACTIVE').length },
    { label: 'Total Budget', value: sets.reduce((sum, a) => sum + (parseFloat(a.daily_budget) || 0), 0) },
  ];
});
const adKpis = computed(() => {
  const adArr = ads[selectedAdSet.value?.id] || [];
  return [
    { label: 'Total Ads', value: adArr.length },
    { label: 'Active', value: adArr.filter(a => a.status === 'ACTIVE').length },
  ];
});
const insightKpis = computed(() => {
  const arr = insights[selectedAd.value?.id] || [];
  const sum = (key) => arr.reduce((s, i) => s + (parseFloat(i[key]) || 0), 0);
  return [
    { label: 'Total Impressions', value: sum('impressions') },
    { label: 'Total Clicks', value: sum('clicks') },
    { label: 'Total Spend', value: sum('spend') },
    { label: 'Avg CTR', value: arr.length ? (sum('clicks') / sum('impressions') * 100).toFixed(2) + '%' : '0%' },
  ];
});

onMounted(loadCampaigns);
</script>

<style scoped>
.dashboard-card {
  margin: 2rem auto;
  max-width: 1200px;
  padding: 2rem;
}
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.breadcrumbs {
  margin-bottom: 1rem;
}
.sync-alert {
  margin-bottom: 1rem;
}
.no-data {
  color: #c00;
  margin: 0.5rem 0 1rem 0;
  font-size: 0.95em;
}
.insight-chart {
  margin-top: 2rem;
}
.nav-btn {
  margin-bottom: 1rem;
}
.raw-toggle {
  margin-bottom: 1rem;
}
.raw-json {
  background: #222;
  color: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.95em;
  max-height: 400px;
  overflow: auto;
}
.kpi-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
.kpi-card {
  background: #f5f7fa;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 1.2rem 2rem;
  min-width: 140px;
  text-align: center;
}
.kpi-label {
  color: #888;
  font-size: 1rem;
  margin-bottom: 0.3rem;
}
.kpi-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #222;
}
@media (max-width: 900px) {
  .dashboard-card {
    padding: 1rem;
    max-width: 100vw;
  }
}
</style> 