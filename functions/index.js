const functions = require("firebase-functions");
const admin = require("firebase-admin");
const dayjs = require("dayjs");
const {
  fetchMetaCampaigns,
  getAdSetsForCampaign,
  getAdsForAdSet,
  getInsightsForAd,
} = require("./metaSync");

admin.initializeApp();
const db = admin.firestore();

exports.syncMetaData = functions.https.onRequest(async (req, res) => {
  // Add CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST");
  res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }
  try {
    const campaigns = await fetchMetaCampaigns();
    if (!campaigns || campaigns.length === 0) {
      console.log("No campaigns fetched from Meta.");
      return res.status(200).json({message: "No campaigns fetched from Meta."});
    }
    for (const campaign of campaigns) {
      const campaignRef = db.collection("meta_campaigns").doc(campaign.id);
      console.log("Writing campaign:", campaign);
      await campaignRef.set(campaign, {merge: true});
      const adSets = await getAdSetsForCampaign(campaign.id);
      for (const adSet of adSets) {
        const adSetRef = campaignRef.collection("ad_sets").doc(adSet.id);
        console.log("Writing ad set:", adSet);
        await adSetRef.set(adSet, {merge: true});
        const ads = await getAdsForAdSet(adSet.id);
        for (const ad of ads) {
          const adRef = adSetRef.collection("ads").doc(ad.id);
          console.log("Writing ad:", ad);
          await adRef.set(ad, {merge: true});
          const insights = await getInsightsForAd(ad.id);
          for (const insight of insights) {
            const date = insight.date_start || dayjs().format("YYYY-MM-DD");
            const insightRef = adRef.collection("insights").doc(date);
            console.log("Writing insight for ad", ad.id, "on", date, ":");
            console.log(insight);
            await insightRef.set(insight, {merge: true});
          }
        }
      }
    }
    res.status(200).json({message: "Meta data sync complete."});
  } catch (error) {
    console.error("Meta sync error:", error);
    res.status(500).json({error: error.message || error});
  }
});
