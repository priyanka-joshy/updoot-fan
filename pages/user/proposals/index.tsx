import { Button, Flex, MediaQuery, Stack, Title } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { BiPlus } from 'react-icons/bi';
import ProposalCard from '@components/proposalCard';

const Proposals: NextPage = () => {
  const router = useRouter();
  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Title order={2}>Entertainment 3.0 starts here</Title>
        <MediaQuery
          smallerThan="xs"
          styles={{
            borderRadius: '50%',
            padding: 0,
            width: '2rem',
            height: '2rem',
            '.mantine-Button-label': {
              display: 'none',
            },
            '.mantine-Button-icon': {
              margin: 0,
            },
          }}>
          <Button
            leftIcon={<BiPlus size={20} />}
            onClick={() => router.push('proposals/create')}>
            Create Proposal
          </Button>
        </MediaQuery>
      </Flex>
      <Flex gap="sm" style={{ overflowX: 'scroll' }}>
        {PROPOSALS.map((proposal) => (
          <ProposalCard {...proposal} />
        ))}
      </Flex>
    </Stack>
  );
};

const PROPOSALS = new Array(4).fill({}).map((_, index) => ({
  id: index.toString(),
  src: '/temp5.png',
  title:
    "I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?",
}));

export default Proposals;
