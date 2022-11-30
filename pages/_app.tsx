import type { AppProps } from 'next/app';
import { AppShell } from '@mantine/core';

import 'styles/globals.css';
import Header from '@components/header';
import Sidebar from '@components/sidebar';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Updoot</title>
      </Head>
      <AppShell
        padding="md"
        navbarOffsetBreakpoint="sm"
        navbar={<Sidebar />}
        header={<Header />}>
        <Component {...pageProps} />
      </AppShell>
    </>
  );
}

export default MyApp;
