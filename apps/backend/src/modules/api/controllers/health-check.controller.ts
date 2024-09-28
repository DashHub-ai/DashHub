import { injectable } from 'tsyringe';

import { BaseController } from './shared';

@injectable()
export class HealthCheckController extends BaseController {
  constructor() {
    super();

    this.router.get(context => context.json({
      status: 'ok',
    }));
  }
}
