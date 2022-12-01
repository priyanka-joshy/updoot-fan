import ApprovalRow from '@components/approvalRow';
import { Button, Flex, Stack, Table } from '@mantine/core';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';

const Approval: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  return (
    <Stack>
      <Flex gap="lg">
        <Button compact variant="light" color="gray">
          Proposals
        </Button>
        <Button compact variant="light" color="gray">
          Comments
        </Button>
        <Button compact variant="light" color="gray">
          Rewards
        </Button>
      </Flex>
      <Table
        withBorder
        style={{ borderRadius: '1rem', borderCollapse: 'separate' }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Comment</th>
            <th>Approval Status</th>
            <th>Date</th>
            <th>Reward</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {props.requests.map((request) => (
            <ApprovalRow {...request} />
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
      comment: 'Lorem ipsum...',
      date: Date.now(),
      reward: Math.floor(Math.random() * 100),
      user: {
        name: 'Hua Xin',
        address: '0xec5A9c67631fD11B46fn633x2d0',
        avatar:
          'https://img.freepik.com/free-vector/' +
          'cute-rabbit-with-duck-working-laptop-' +
          'cartoon-illustration_56104-471.jpg?w=2000',
      },
    })),
  },
});

export default Approval;
