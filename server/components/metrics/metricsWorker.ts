import { MetricsService } from './metricsService';
export default (_app, worker): void => {
  // Listen Callback from Worker
  worker.on('message', async msg => {
    if (msg.cmd === 'cb') {
      const data = { statusCode: msg.code, ms: msg.ms, checkerId: msg.id };
      await MetricsService.sendWebhookNotif(data);
      await MetricsService.addMetric(data);
    }
  });
};
