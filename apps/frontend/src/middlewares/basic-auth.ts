import { defineMiddleware } from 'astro/middleware';

import { SERVER_CONFIG } from '~/server';

export const basicAuthMiddleware = defineMiddleware((context, next) => {
  if (!SERVER_CONFIG.basicAuth) {
    return next();
  }

  const expectedCredentials = SERVER_CONFIG.basicAuth;
  const basicAuth = context.request.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1] ?? 'username:password';
    const [username, password] = atob(authValue).split(':');

    if (username === expectedCredentials.username && password === expectedCredentials.password) {
      return next();
    }
  }

  return new Response(
    'Auth required',
    {
      status: 401,
      headers: {
        'WWW-authenticate': 'Basic realm="Secure Area"',
      },
    },
  );
});
