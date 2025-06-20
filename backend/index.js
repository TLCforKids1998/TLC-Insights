// TLC Insights Backend Entry Point

const {
  fetchMetaCampaigns,
  getAdSetsForCampaign,
  getAdsForAdSet,
  getInsightsForAd,
} = require('./services/meta');
const { fetchGAEvents } = require('./services/ga');
const { fetchGTMEvents } = require('./services/gtm');
const { writeMetaCampaign, getMetaCampaigns, initFirestore } = require('./services/firestore');
const dayjs = require('dayjs');

async function syncMetaCampaignsFull() {
  console.log('Starting full Meta campaigns synchronization...');
  const db = initFirestore();
  const campaigns = await fetchMetaCampaigns();
  if (!campaigns || campaigns.length === 0) {
    console.log('No campaigns fetched from Meta. Synchronization finished.');
    return;
  }
  for (const campaign of campaigns) {
    const campaignRef = db.collection('meta_campaigns').doc(campaign.id);
    await campaignRef.set(campaign, { merge: true });
    console.log(`Wrote campaign: ${campaign.name} (${campaign.id})`);
    // Fetch and write ad sets
    const adSets = await getAdSetsForCampaign(campaign.id);
    for (const adSet of adSets) {
      const adSetRef = campaignRef.collection('ad_sets').doc(adSet.id);
      await adSetRef.set(adSet, { merge: true });
      console.log(`  Wrote ad set: ${adSet.name} (${adSet.id})`);
      // Fetch and write ads
      const ads = await getAdsForAdSet(adSet.id);
      for (const ad of ads) {
        const adRef = adSetRef.collection('ads').doc(ad.id);
        await adRef.set(ad, { merge: true });
        console.log(`    Wrote ad: ${ad.name} (${ad.id})`);
        // Fetch and write daily insights
        const insights = await getInsightsForAd(ad.id);
        for (const insight of insights) {
          const date = insight.date_start || dayjs().format('YYYY-MM-DD');
          const insightRef = adRef.collection('insights').doc(date);
          await insightRef.set(insight, { merge: true });
          console.log(`      Wrote insight for ${date}`);
        }
      }
    }
  }
  console.log('✅ Full Meta campaigns sync complete.');
}

async function main() {
  try {
    await syncMetaCampaignsFull();
    // In the future, we can add other sync functions here
    // await syncGoogleAnalytics();
  } catch (error) {
    console.error('❌ An error occurred during the main synchronization process:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
} 