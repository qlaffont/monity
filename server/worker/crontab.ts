/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from 'mongoose';
import parser from 'cron-parser';
import { CheckersService } from './../components/checkers/checkersService';
import { MetricsService } from '../components/metrics/metricsService';
import { ping, http } from '../services/fetch/fetch';
import { CheckerType } from '../components/checkers/checkersModel';
import { DashboardService } from '../components/dashboard/dashboardService';

const getKeyFormat = (date: number): string => {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(date).toLocaleDateString('en-GB', options);
};

const cronNeedToBeExecuted = (cronString: string): boolean => {
  const nowString = getKeyFormat(Date.now());

  const interval = parser.parseExpression(cronString);
  const nextTime = interval.next().getTime();
  const prevTime = interval.prev().getTime();

  const nextString = getKeyFormat(nextTime);
  const prevString = getKeyFormat(prevTime);

  return nextString === nowString || prevString === nowString;
};

const getCheckersToRun = async (): Promise<CheckerType[]> => {
  let checkers = await CheckersService.getActiveCheckers();
  checkers = checkers.filter(({ cron }) => cronNeedToBeExecuted(cron));

  return checkers;
};

const pingAsync = (data): Promise<any> => {
  return (async () => {
    return new Promise(resolve => {
      ping(data, res => {
        resolve(res);
      });
    });
  })();
};

const httpAsync = (data): Promise<any> => {
  return (async () => {
    return new Promise(resolve => {
      http(data, res => {
        resolve(res);
      });
    });
  })();
};

const executeChecker = async (checkers): Promise<void> => {
  const prom = (checker): Promise<void> => {
    return new Promise(async resolve => {
      const { _id: id, checkerType: type, address, port } = checker;
      let result;

      if (type === 'ping') {
        result = await pingAsync({ address, port, id });
      }

      if (type === 'http') {
        result = await httpAsync({ address, id });
      }

      if (result) {
        const data = { statusCode: result.code, ms: result.ms, checkerId: result.id };
        await MetricsService.sendWebhookNotif(data);
        await MetricsService.addMetric(data);
      }
      resolve();
    });
  };

  const promsArray = [];

  for (let index = 0; index < checkers.length; index++) {
    // @ts-ignore
    promsArray.push(prom(checkers[index]));
  }

  await Promise.all(promsArray);
};

const executeClean = async () => {
  const cron = '* * */8 * *';

  if (cronNeedToBeExecuted(cron)) {
    await MetricsService.cleanOldMetric();
  }
};

const executeCache = async () => {
  const cron = '*/5 * * * *';

  if (cronNeedToBeExecuted(cron)) {
    await DashboardService.loadCache();
  }
};

const run = async (): Promise<void> => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  const checkers = await getCheckersToRun();

  await executeChecker(checkers);

  await executeClean();
  await executeCache();

  await mongoose.connection.close();
};

run();
