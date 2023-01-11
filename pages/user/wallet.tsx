import { Stack, Table } from '@mantine/core';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { BsStars } from 'react-icons/bs';

import styles from 'styles/user/wallet.module.scss';
import TransactionRow from '@components/transactionRow';
import {
  Heading1,
  Subheading1,
  BodyText,
  Subheading3,
} from '@components/typography';
import api from 'src/utils/api';
import { withSSRContext } from 'aws-amplify';
import getWalletBalance from 'src/utils/getWalletBalance';
import { Transaction } from 'src/utils/types';

const Wallet: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  return (
    <div>
      <Heading1>Wallet</Heading1>
      <Subheading1 color="#A1A1A1">Review your assets</Subheading1>
      <div className={styles.wallet}>
        <Stack pr="3rem">
          <BodyText>Stardust Wallet</BodyText>
          <Subheading3 color="#6200FF">
            Wallet ID: {props.walletAddress}
          </Subheading3>
        </Stack>
        <BsStars size={30} color="#6200FF" />
        <Heading1> {props.balance}</Heading1>
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

export const getServerSideProps: GetServerSideProps<{
  balance: number;
  transactions: any[];
  walletAddress: string;
}> = async (context) => {
  const SSR = withSSRContext(context);
  const { name } = (await SSR.Auth.currentAuthenticatedUser()).attributes;
  const userRes = await api.user.get(`/getUserByUsername/${name}`);
  const { walletAddress } = userRes.message;
  const balance = await getWalletBalance(walletAddress);
  const { message: transactions } = await api.user.get(
    `/transactionByUsername/all/${name}`
  );
  const allTransactions: Transaction[] = [
    ...transactions.asReceiver,
    ...transactions.asSender,
  ];

  console.log([...transactions.asReceiver, ...transactions.asSender]);
  return {
    props: {
      balance,
      transactions: allTransactions.map((tx) => ({
        action: tx.type,
        date: tx.timestamp,
        amount: tx.amount,
      })),
      walletAddress,
    },
  };
};

export default Wallet;
