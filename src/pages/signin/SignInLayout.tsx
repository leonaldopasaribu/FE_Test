import React from 'react';
import GridShape from '../../components/common/GridShape';
import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
        {children}
        <div className="bg-brand-950 hidden h-full w-full items-center lg:grid lg:w-1/2 dark:bg-white/5">
          <div className="relative z-1 flex items-center justify-center">
            <GridShape />
            <div className="flex max-w-xl flex-col items-center">
              <p className="text-center leading-relaxed text-gray-400 dark:text-white/60">
                <span className="mb-4 block text-3xl font-bold text-white dark:text-white">
                  Jasa Marga Dashboard
                </span>
                <span className="block text-lg opacity-90">
                  Satu platform terpadu untuk mengawal konektivitas Indonesia.{' '}
                  <br />
                  Data akurat, keputusan cepat, layanan terbaik — <br />
                  karena setiap kilometer perjalanan adalah amanah kami.
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="fixed right-6 bottom-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
