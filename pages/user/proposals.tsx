import { Button, Flex, MediaQuery, Stack, Title } from '@mantine/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { BiPlus } from 'react-icons/bi';
import ProposalCard from '@components/proposalcard';

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
        <ProposalCard
          id={'1'}
          src={'/temp5.png'}
          title="I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?"
        />
        <ProposalCard
          id={'2'}
          src={'/temp5.png'}
          title="I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?"
        />
        <ProposalCard
          id={'3'}
          src={'/temp5.png'}
          title="I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?"
        />
        <ProposalCard
          id={'4'}
          src={'/temp5.png'}
          title="I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?"
        />
      </Flex>
    </Stack>
  );
};

export default Proposals;
