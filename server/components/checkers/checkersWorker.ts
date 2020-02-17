import { CheckersService } from './checkersService';
export default (_app, worker): void => {
  // Start Active Checker
  (async (): Promise<void> => {
    const checkers = await CheckersService.getCheckers();

    checkers.map(async checker => {
      if (checker.active) {
        // @ts-ignore
        await CheckersService.startChecker(checker._id, worker);
      }
    });
  })();
};
