import type { AppProps } from 'next/app';
import { AppShell } from '@mantine/core';

import '../styles/globals.css';
import Header from '../src/components/header';
import Sidebar from '../src/components/sidebar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      navbar={<Sidebar />}
      header={<Header />}>
      <Component {...pageProps} />
    </AppShell>
  );
}

export default MyApp;
