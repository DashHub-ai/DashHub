import type { PropsWithChildren } from 'react';

import { BrandLogoSVG } from '@llm/ui';

import { ChooseLanguageItem } from './navigation/choose-language-item';

export function FullPageWithBrandLayout({ children }: PropsWithChildren) {
  return (
    <main className="grid h-screen grid-cols-2">
      <div className="col-span-1 hidden flex-col justify-between bg-zinc-900 p-8 text-white lg:flex">
        <div className="flex items-center text-lg font-medium">
          <BrandLogoSVG />
          DashHub
        </div>

        <blockquote className="space-y-2">
          <p className="text-lg">
            "If anyone here believes in telekinesis, raise my hand"
          </p>
          <footer className="text-sm">Kurt Vonnegut</footer>
        </blockquote>
      </div>

      <div className="col-span-2 flex flex-col p-8 lg:col-span-1">
        <div className="flex flex-none justify-end">
          <ChooseLanguageItem />
        </div>

        <div className="flex flex-1 items-center justify-center">
          {children}
        </div>
      </div>
    </main>
  );
}
