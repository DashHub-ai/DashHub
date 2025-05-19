import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import { createContext, type PropsWithChildren, useMemo } from 'react';
import { z } from 'zod';

import { useContextOrThrow, useLocalStorageObject, useRefSafeCallback } from '@dashhub/commons-front';
import { type SdkIdNameUrlEntryT, SdkTableRowIdV, SdkTableRowWithIdNameV, useSdk } from '@dashhub/sdk';

const WorkspaceSettingsV = z.object({
  forUserId: SdkTableRowIdV.nullable(),
  organization: SdkTableRowWithIdNameV.nullable(),
});

type WorkspaceSettingsT = z.infer<typeof WorkspaceSettingsV>;

export type WorkspaceContextValue =
  & WorkspaceSettingsT
  & {
    setOrganization: (organization: SdkIdNameUrlEntryT | null) => void;
  };

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: PropsWithChildren) {
  const { session } = useSdk();
  const settings = useLocalStorageObject('selected-workspace-settings', {
    schema: WorkspaceSettingsV,
  });

  const setOrganization = useRefSafeCallback((organization: SdkIdNameUrlEntryT | null) => {
    if (!session.isLoggedIn) {
      return;
    }

    settings.set({
      forUserId: session.token.sub,
      organization: organization && {
        id: organization.id,
        name: organization.name,
      },
    });
  });

  const value = useMemo<WorkspaceContextValue>(() => ({
    ...pipe(
      settings.get(),
      O.chain((settings) => {
        if (!session.isLoggedIn || settings.forUserId !== session.token.sub) {
          return O.none;
        }

        return O.some(settings);
      }),
      O.getOrElse((): WorkspaceSettingsT => ({
        forUserId: null,
        organization: null,
      })),
    ),
    setOrganization,
  }), [settings.revision]);

  return (
    <WorkspaceContext value={value}>
      {children}
    </WorkspaceContext>
  );
}

export const useWorkspace = () => useContextOrThrow(WorkspaceContext, 'Missing workspace context!');
