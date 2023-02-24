var cron = require('node-cron');
const { processData} = require('./jobs/panigationData')
cron.schedule('0 0 * * *', async () => {
    console.log('Starting Panigation Data ');
    await processData();
    console.log('Finished Panigation Data');
  });