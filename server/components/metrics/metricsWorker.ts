import { DashboardService } from './../dashboard/dashboardService';
import { MetricsService } from './metricsService';
export default (_app, worker): void => {
  // Listen Callback from Worker
  worker.on('message', async msg => {
    if (msg.cmd === 'cb') {
      const data = { statusCode: msg.code, ms: msg.ms, checkerId: msg.id };
      await MetricsService.sendWebhookNotif(data);
      await MetricsService.addMetric(data);
    }

    if (msg.cmd === 'clean') {
      await MetricsService.cleanOldMetric();
    }

    if (msg.cmd === 'cache') {
      await DashboardService.loadCache();
    }
  });

  if (!process.env.DISABLE_AUTOCLEAN) {
    // Clean old metrics
    (async (): Promise<void> => {
      await MetricsService.cleanOldMetric();

      worker.postMessage({ cmd: 'clean' });
    })();
  }

  (async (): Promise<void> => {
    await DashboardService.loadCache();

    worker.postMessage({ cmd: 'cache' });
  })();
};
