import type { AppProps } from 'next/app';
import { AppShell } from '@mantine/core';

import '../styles/_global.scss';
import Header from '../src/components/header';
import Sidebar from '../src/components/sidebar';
// amplify authentication
import { useRouter } from 'next/router';
import { AuthProvider } from '../src/utils/auth/authContext';
import { ProtectedPage } from '../src/utils/auth/ProtectedPage';

import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Updoot</title>
        <link rel="shortcut icon" href="/logo.svg" />
      </Head>
      <AuthProvider>
        {router.pathname === '/' ? (
          <Component {...pageProps} />
        ) : (
          <ProtectedPage>
            <AppShell
              padding="md"
              navbarOffsetBreakpoint="sm"
              navbar={<Sidebar />}
              header={<Header />}>
              <Component {...pageProps} />
            </AppShell>
          </ProtectedPage>
        )}
      </AuthProvider>
    </>
  );
}

export default MyApp;
