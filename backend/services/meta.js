// Meta Ads API Integration Stub
// This module will handle authentication and data fetching from the Meta (Facebook/Instagram) Marketing API.

const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const bizSdk = require('facebook-nodejs-business-sdk');
const dayjs = require('dayjs');

// Initialize the Secret Manager client
const secretManagerClient = new SecretManagerServiceClient();
const projectId = 'tlc-insights';

/**
 * Fetches a secret from Google Secret Manager.
 * @param {string} secretName The name of the secret to fetch.
 * @returns {Promise<string>} The secret value.
 */
async function getSecret(secretName) {
  const [version] = await secretManagerClient.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
  });
  return version.payload.data.toString();
}

/**
 * Initializes the Meta API with credentials fetched from Secret Manager.
 * @returns {Promise<object>} An object containing the initialized API and Ad Account ID.
 */
async function initializeMetaApi() {
  // Fetch all secrets in parallel for efficiency
  const [
    accessToken,
    rawAdAccountId,
  ] = await Promise.all([
    getSecret('META_ACCESS_TOKEN'),
    getSecret('META_AD_ACCOUNT_ID'),
  ]);

  // Ensure the ad account ID is prefixed with 'act_'
  const adAccountId = rawAdAccountId.startsWith('act_') ? rawAdAccountId : `act_${rawAdAccountId}`;

  const api = bizSdk.FacebookAdsApi.init(accessToken);
  return { api, adAccountId };
}

/**
 * Fetches campaign data from the Meta Marketing API.
 * @returns {Promise<Array>} A promise that resolves to an array of campaign objects.
 */
async function fetchMetaCampaigns() {
  try {
    const { adAccountId } = await initializeMetaApi();
    const AdAccount = bizSdk.AdAccount;
    const Campaign = bizSdk.Campaign;
    
    const account = new AdAccount(adAccountId);
    const campaigns = await account.getCampaigns([
      Campaign.Fields.id,
      Campaign.Fields.name,
      Campaign.Fields.status,
      Campaign.Fields.objective,
      Campaign.Fields.created_time,
    ]);

    const campaignsData = campaigns.map(campaign => campaign._data);
    console.log(`Successfully fetched ${campaignsData.length} campaigns.`);
    return campaignsData;

  } catch (error) {
    console.error('Error fetching Meta campaigns:', error.message || error);
    return [];
  }
}

/**
 * Fetches ad sets for a given campaign.
 * @param {string} campaignId
 * @returns {Promise<Array>} Array of ad set objects
 */
async function getAdSetsForCampaign(campaignId) {
  const AdCampaign = bizSdk.Campaign;
  const AdSet = bizSdk.AdSet;
  const campaign = new AdCampaign(campaignId);
  const adSets = await campaign.getAdSets([
    AdSet.Fields.id,
    AdSet.Fields.name,
    AdSet.Fields.status,
    AdSet.Fields.daily_budget,
    AdSet.Fields.start_time,
    AdSet.Fields.end_time,
  ]);
  return adSets.map(adSet => adSet._data);
}

/**
 * Fetches ads for a given ad set.
 * @param {string} adSetId
 * @returns {Promise<Array>} Array of ad objects
 */
async function getAdsForAdSet(adSetId) {
  const AdSet = bizSdk.AdSet;
  const Ad = bizSdk.Ad;
  const adSet = new AdSet(adSetId);
  const ads = await adSet.getAds([
    Ad.Fields.id,
    Ad.Fields.name,
    Ad.Fields.status,
    Ad.Fields.creative,
  ]);
  return ads.map(ad => ad._data);
}

/**
 * Fetches daily insights for a given ad.
 * @param {string} adId
 * @returns {Promise<Array>} Array of daily insight objects
 */
async function getInsightsForAd(adId) {
  const Ad = bizSdk.Ad;
  const ad = new Ad(adId);
  // Fetch insights for the last 30 days
  const since = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
  const until = dayjs().format('YYYY-MM-DD');
  const insights = await ad.getInsights([
    'impressions',
    'clicks',
    'spend',
    'actions',
    'date_start',
    'date_stop',
  ], {
    time_increment: 1,
    time_range: { since, until },
  });
  return insights.map(insight => insight._data);
}

module.exports = {
  fetchMetaCampaigns,
  getAdSetsForCampaign,
  getAdsForAdSet,
  getInsightsForAd,
}; 