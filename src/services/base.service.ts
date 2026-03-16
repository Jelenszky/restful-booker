import { APIRequestContext } from '@playwright/test';

export abstract class BaseService {
  constructor(
    protected baseURL: string,
    protected requestContext: APIRequestContext
  ) {}
}
