import FinancialRow from '@components/financialRow';
import { Flex, Stack, Table, Text, Title } from '@mantine/core';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import styles from 'styles/admin/financial.module.scss';

const Financial: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  return (
    <Stack>
      <Flex gap="lg">
        <Stack spacing={22} className={styles.outline1}>
          <Text weight={700} color="#5C5C5C">
            Marketing Team Wallet
            <Text color="#A1A1A1">Warner Music HK: Division 1</Text>
          </Text>
          <Flex align="center" gap="xs">
            <Text weight={600} color="#A1A1A1">
              Wallet ID:
            </Text>
            <Text color="#A1A1A1">WM-MA90d62BC9cb00</Text>
          </Flex>
        </Stack>
        <Stack spacing={10} className={styles.outline2}>
          <Text weight={600}>Total Assets</Text>
          <Text weight={700} size={24}>
            40K $SD
          </Text>
        </Stack>
        <Stack spacing={10} className={styles.outline2}>
          <Text weight={600}>Total Deposits</Text>
          <Text weight={700} size={24}>
            18K $SD
          </Text>
        </Stack>
      </Flex>
      <Title>Treasury History</Title>
      <Table withBorder className={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Amount</th>
            <th>Action</th>
            <th>Date</th>
            <th>User Level</th>
          </tr>
        </thead>
        <tbody>
          {props.requests.map((request) => (
            <FinancialRow {...request} />
          ))}
        </tbody>
      </Table>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps<{
  requests: any[];
}> = async () => ({
  props: {
    requests: new Array(20).fill({}).map(() => ({
      action: 'Lorem ipsum...',
      date: Date.now(),
      amount: Math.floor(Math.random() * 2000 - 1000),
      user: {
        name: 'Hua Xin',
        address: '0xec5A9c67631fD11B46fn633x2d0',
        avatar:
          'https://img.freepik.com/free-vector/' +
          'cute-rabbit-with-duck-working-laptop-' +
          'cartoon-illustration_56104-471.jpg?w=2000',
        level: Math.floor(Math.random() * 24 + 1),
      },
    })),
  },
});
export default Financial;
