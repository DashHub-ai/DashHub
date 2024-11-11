import { useSdk } from '@llm/sdk';

import { withSdk } from './sdk-wrapper';

export const LoginButton = withSdk(() => {
  const { session } = useSdk();

  if (session.isLoggedIn) {
    return (
      <a href="/app" className="bg-black hover:bg-gray-800 px-4 py-2 rounded text-white">
        Go to App
      </a>
    );
  }

  return (
    <a href="/app" className="bg-black hover:bg-gray-800 px-4 py-2 rounded text-white">
      Login
    </a>
  );
});
