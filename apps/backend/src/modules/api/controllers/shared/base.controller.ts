import { Hono } from 'hono';

export abstract class BaseController {
  public readonly router = new Hono();
}
