import {
  BodyText,
  Heading1,
  Heading4,
  Subheading1,
  Subheading3,
} from '@components/typography';
import { Flex, Stack, Tabs, UnstyledButton } from '@mantine/core';
import { NextPage } from 'next';
import { TbChevronRight } from 'react-icons/tb';
import { BsStars } from 'react-icons/bs';

import styles from 'styles/user/profile.module.scss';
import ProposalCard from '@components/proposalCard';
import VoteRow from '@components/voteRow';
import { useRouter } from 'next/router';

const Profile: NextPage = () => {
  const router = useRouter();
  return (
    <div>
      <Flex justify="space-between" wrap="wrap">
        <div>
          <Heading1>Profile</Heading1>
          <Subheading1 color="#A1A1A1">
            Manage your assets and activity
          </Subheading1>
        </div>
        <Flex align="center" gap="md">
          <Stack align="end" spacing={0}>
            <Heading4>John Doe</Heading4>
            <Subheading1 color="#A1A1A1">
              Joined: {new Date().toLocaleDateString()}
            </Subheading1>
          </Stack>
          <img
            className={styles.image}
            src={
              'https://img.freepik.com/free-vector/' +
              'cute-rabbit-with-duck-working-laptop-' +
              'cartoon-illustration_56104-471.jpg?w=2000'
            }
          />
        </Flex>
      </Flex>
      <UnstyledButton
        className={styles.wallet}
        onClick={() => router.push('wallet')}>
        <Stack pr="3rem">
          <BodyText>Stardust Wallet</BodyText>
          <Subheading3 color="#6200FF">Wallet ID: F-90d62Biuq524</Subheading3>
        </Stack>
        <BsStars size={30} color="#6200FF" />
        <Heading1> 20000</Heading1>
        <TbChevronRight size={30} />
      </UnstyledButton>
      <Tabs defaultValue="proposals" color="gray">
        <Tabs.List grow pr="20%" my="xl">
          <Tabs.Tab value="proposals">
            <Subheading1>Proposals</Subheading1>
          </Tabs.Tab>
          <Tabs.Tab value="drafts">
            <Subheading1>Drafts</Subheading1>
          </Tabs.Tab>
          <Tabs.Tab value="comments">
            <Subheading1>Comments</Subheading1>
          </Tabs.Tab>
          <Tabs.Tab value="votes">
            <Subheading1>Votes</Subheading1>
          </Tabs.Tab>
          <Tabs.Tab value="likes">
            <Subheading1>Likes</Subheading1>
          </Tabs.Tab>
          <Tabs.Tab value="bookmarks">
            <Subheading1>Bookmarks</Subheading1>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="proposals" pt="xs">
          <Flex gap="xl" wrap="wrap">
            {PROPOSALS.map((proposal) => (
              <ProposalCard {...proposal} />
            ))}
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="drafts" pt="xs">
          Content
        </Tabs.Panel>
        <Tabs.Panel value="comments" pt="xs">
          Content
        </Tabs.Panel>
        <Tabs.Panel value="votes" pt="xs">
          {VOTES.map((vote) => (
            <VoteRow {...vote} />
          ))}
        </Tabs.Panel>
        <Tabs.Panel value="likes" pt="xs">
          <Flex gap="sm" wrap="wrap">
            {PROPOSALS.map((proposal) => (
              <ProposalCard {...proposal} />
            ))}
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="bookmarks" pt="xs">
          <Flex gap="sm" wrap="wrap">
            {PROPOSALS.map((proposal) => (
              <ProposalCard {...proposal} />
            ))}
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

const PROPOSALS = new Array(5).fill({}).map((_, index) => ({
  id: index.toString(),
  src: '/temp5.png',
  title:
    "I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?",
}));

const VOTES = new Array(3).fill({}).map((_, index) => ({
  title:
    'I quoted one of Valtina’s lyric to a merch. Should we have this for the event?',
  timestamp: Date.now(),
  amount: -1000,
  src: '/temp5.png',
}));

export default Profile;
