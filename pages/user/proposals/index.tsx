import { Flex, Stack } from '@mantine/core';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { TbPlus } from 'react-icons/tb';

import ProposalCard from '@components/proposalCard';
import { Heading2, Subheading1 } from '@components/typography';
import Button from '@components/button';

const Proposals: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  return (
    <Stack>
      <Flex justify="space-between" align="center">
        <Heading2>Entertainment 3.0 starts here</Heading2>
        <Button color="black" onClick={() => router.push('proposals/create')}>
          <TbPlus style={{ verticalAlign: 'middle' }} />
        </Button>
      </Flex>
      <Subheading1>Discover Proposals</Subheading1>
      <Flex gap="md" my="md">
        {['All', 'Artist Campaigns', 'Newest', 'Ending Soon', 'Trending'].map(
          (value) => (
            <Button
              size="sm"
              color="black"
              type={filter === value ? 'primary' : 'secondary'}
              onClick={() => setFilter(value)}>
              {value}
            </Button>
          )
        )}
      </Flex>
      <Flex gap="xl" wrap="wrap">
        {props.proposals.map((proposal) => (
          <ProposalCard {...proposal} />
        ))}
      </Flex>
    </Stack>
  );
};

export const getStaticProps: GetStaticProps<{
  proposals: any[];
}> = async () => ({
  props: {
    proposals: new Array(5).fill({}).map((_, index) => ({
      id: index.toString(),
      src: '/temp5.png',
      title:
        "I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?",
    })),
  },
});

export default Proposals;
