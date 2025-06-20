// TLC Insights Backend Entry Point

const { fetchMetaCampaigns } = require('./services/meta');
const { fetchGAEvents } = require('./services/ga');
const { fetchGTMEvents } = require('./services/gtm');

async function main() {
  // Placeholder for orchestrating data fetches
  const metaCampaigns = await fetchMetaCampaigns();
  const gaEvents = await fetchGAEvents();
  const gtmEvents = await fetchGTMEvents();

  console.log('Meta Campaigns:', metaCampaigns);
  console.log('GA Events:', gaEvents);
  console.log('GTM Events:', gtmEvents);
}

if (require.main === module) {
  main();
} 