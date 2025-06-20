const bizSdk = require("facebook-nodejs-business-sdk");
const {SecretManagerServiceClient} = require("@google-cloud/secret-manager");
const dayjs = require("dayjs");

const secretManagerClient = new SecretManagerServiceClient();
const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT ||
  "tlc-insights";

/**
 * @param {string} secretName
 */
async function getSecret(secretName) {
  const [version] = await secretManagerClient.accessSecretVersion({
    name: `projects/${projectId}/secrets/${secretName}/versions/latest`,
  });
  return version.payload.data.toString();
}

/** */
async function initializeMetaApi() {
  const [accessToken, rawAdAccountId] = await Promise.all([
    getSecret("META_ACCESS_TOKEN"),
    getSecret("META_AD_ACCOUNT_ID"),
  ]);
  const adAccountId = rawAdAccountId.startsWith("act_") ?
    rawAdAccountId :
    `act_${rawAdAccountId}`;
  bizSdk.FacebookAdsApi.init(accessToken);
  return {adAccountId};
}

/** */
async function fetchMetaCampaigns() {
  const {adAccountId} = await initializeMetaApi();
  const AdAccount = bizSdk.AdAccount;
  const Campaign = bizSdk.Campaign;
  const account = new AdAccount(adAccountId);
  const campaigns = await account.getCampaigns([
    Campaign.Fields.id,
    Campaign.Fields.name,
    Campaign.Fields.status,
    Campaign.Fields.objective,
    Campaign.Fields.created_time,
    Campaign.Fields.start_time,
    Campaign.Fields.stop_time,
    Campaign.Fields.buying_type,
    Campaign.Fields.spend_cap,
    Campaign.Fields.budget_rebalance_flag,
    Campaign.Fields.effective_status,
    Campaign.Fields.daily_budget,
    Campaign.Fields.lifetime_budget,
    Campaign.Fields.account_id,
    Campaign.Fields.updated_time,
    Campaign.Fields.special_ad_categories,
    Campaign.Fields.bid_strategy,
    Campaign.Fields.campaign_group_id,
    Campaign.Fields.configured_status,
    Campaign.Fields.source_campaign_id,
    Campaign.Fields.topline_id,
    Campaign.Fields.tracking_specs,
    Campaign.Fields.pacing_type,
    Campaign.Fields.promoted_object,
    Campaign.Fields.recommendations,
    Campaign.Fields.insights,
  ]);
  return campaigns.map((campaign) => campaign._data);
}

/**
 * @param {string} campaignId
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
    AdSet.Fields.lifetime_budget,
    AdSet.Fields.start_time,
    AdSet.Fields.end_time,
    AdSet.Fields.bid_amount,
    AdSet.Fields.billing_event,
    AdSet.Fields.optimization_goal,
    AdSet.Fields.targeting,
    AdSet.Fields.account_id,
    AdSet.Fields.campaign_id,
    AdSet.Fields.created_time,
    AdSet.Fields.updated_time,
    AdSet.Fields.effective_status,
    AdSet.Fields.pacing_type,
    AdSet.Fields.promoted_object,
    AdSet.Fields.recommendations,
    AdSet.Fields.source_adset_id,
    AdSet.Fields.tracking_specs,
  ]);
  return adSets.map((adSet) => adSet._data);
}

/**
 * @param {string} adSetId
 */
async function getAdsForAdSet(adSetId) {
  const AdSet = bizSdk.AdSet;
  const Ad = bizSdk.Ad;
  const adSet = new AdSet(adSetId);
  const ads = await adSet.getAds([
    Ad.Fields.id,
    Ad.Fields.name,
    Ad.Fields.status,
    Ad.Fields.account_id,
    Ad.Fields.adset_id,
    Ad.Fields.campaign_id,
    Ad.Fields.created_time,
    Ad.Fields.updated_time,
    Ad.Fields.effective_status,
    Ad.Fields.tracking_specs,
    Ad.Fields.creative,
    Ad.Fields.bid_amount,
    Ad.Fields.bid_info,
    Ad.Fields.configured_status,
    Ad.Fields.recommendations,
    Ad.Fields.source_ad_id,
  ]);
  return ads.map((ad) => ad._data);
}

/**
 * @param {string} adId
 */
async function getInsightsForAd(adId) {
  const Ad = bizSdk.Ad;
  const ad = new Ad(adId);
  const since = dayjs().subtract(30, "day").format("YYYY-MM-DD");
  const until = dayjs().format("YYYY-MM-DD");
  const insights = await ad.getInsights([
    "impressions",
    "clicks",
    "spend",
    "actions",
    "date_start",
    "date_stop",
    "cpc",
    "cpm",
    "cpp",
    "ctr",
    "reach",
    "unique_clicks",
    "unique_ctr",
    "frequency",
    "inline_link_clicks",
    "inline_post_engagement",
    "objective",
    "ad_id",
    "ad_name",
    "adset_id",
    "adset_name",
    "campaign_id",
    "campaign_name",
    "account_id",
    "cost_per_inline_link_click",
    "cost_per_unique_click",
    "actions_per_impression",
    "unique_actions",
    "video_plays",
    "video_plays_at_100",
    "video_plays_at_25",
    "video_plays_at_50",
    "video_plays_at_75",
    "video_plays_at_95",
    "website_ctr",
    "website_purchase_roas",
    "purchase_roas",
    "outbound_clicks",
    "outbound_clicks_ctr",
    "unique_outbound_clicks",
    "unique_outbound_clicks_ctr",
  ], {
    time_increment: 1,
    time_range: {since, until},
  });
  return insights.map((insight) => insight._data);
}

module.exports = {
  fetchMetaCampaigns,
  getAdSetsForCampaign,
  getAdsForAdSet,
  getInsightsForAd,
  initializeMetaApi,
};
