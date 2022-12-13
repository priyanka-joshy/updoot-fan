import { Stack, Table } from '@mantine/core';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import router from 'next/router';
import { BsStars } from 'react-icons/bs';

import styles from 'styles/user/wallet.module.scss';
import TransactionRow from '@components/transactionRow';
import {
  Heading1,
  Subheading1,
  BodyText,
  Subheading3,
} from '@components/typography';

const Wallet: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  return (
    <div>
      <Heading1>Wallet</Heading1>
      <Subheading1 color="#A1A1A1">Review your assets</Subheading1>
      <div className={styles.wallet} onClick={() => router.push('wallet')}>
        <Stack pr="3rem">
          <BodyText>Stardust Wallet</BodyText>
          <Subheading3 color="#6200FF">Wallet ID: F-90d62Biuq524</Subheading3>
        </Stack>
        <BsStars size={30} color="#6200FF" />
        <Heading1> 20000</Heading1>
      </div>
      <Subheading1>Transaction History</Subheading1>
      <Table withBorder className={styles.table}>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Action</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {props.transactions.map((transaction) => (
            <TransactionRow {...transaction} />
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  transactions: any[];
}> = async () => ({
  props: {
    transactions: new Array(20).fill({}).map(() => ({
      action: 'Lorem ipsum...',
      date: Date.now(),
      amount: Math.floor(Math.random() * 2000 - 1000),
    })),
  },
});

export default Wallet;
