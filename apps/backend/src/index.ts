import 'reflect-metadata';

import { container } from 'tsyringe';

import { BootService } from '~/modules/boot';

container.resolve(BootService).boot();
