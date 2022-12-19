import { Flex, Stack, Tabs, UnstyledButton } from '@mantine/core';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { useRouter } from 'next/router';
import { TbChevronRight } from 'react-icons/tb';
import { BsStars } from 'react-icons/bs';

import styles from 'styles/user/profile.module.scss';
import {
  BodyText,
  Heading1,
  Heading4,
  Subheading1,
  Subheading3,
} from '@components/typography';
import ProposalCard from '@components/proposalCard';
import VoteRow from '@components/voteRow';
import Button from '@components/button';

const Profile: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
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
          <Flex
            gap="xl"
            wrap="wrap"
            justify={props.proposals.length === 0 ? 'center' : undefined}>
            {props.proposals.length > 0 ? (
              props.proposals.map((proposal) => <ProposalCard {...proposal} />)
            ) : (
              <Stack align="center" justify="center" h="40vh" w="30%">
                <img src="/proposalEmpty.png" />
                <BodyText color="#5C5C5C" style={{ textAlign: 'center' }}>
                  Start building your very own proposal now! It will only take a
                  few clicks.
                </BodyText>
                <Button
                  size="lg"
                  onClick={() => router.push('proposals/create')}>
                  Upload your first proposal
                </Button>
              </Stack>
            )}
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="drafts" pt="xs">
          <Flex
            gap="xl"
            wrap="wrap"
            justify={props.drafts.length === 0 ? 'center' : undefined}>
            {props.drafts.length > 0 ? (
              <></>
            ) : (
              <EmptyState
                title="No drafts yet."
                text="Save your proposals for later to view them here"
              />
            )}
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="comments" pt="xs">
          {props.comments.length > 0 ? (
            <></>
          ) : (
            <Flex justify="center">
              <EmptyState
                title="No comments yet."
                text="Engage with the community by commenting on proposals"
              />
            </Flex>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="votes" pt="xs">
          {props.votes.length > 0 ? (
            props.votes.map((vote) => <VoteRow {...vote} />)
          ) : (
            <Flex justify="center">
              <EmptyState
                title="No votes yet."
                text="Actively drive ideas by voting on proposals"
              />
            </Flex>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="likes" pt="xs">
          <Flex
            gap="xl"
            wrap="wrap"
            justify={props.proposals.length === 0 ? 'center' : undefined}>
            {props.proposals.length > 0 ? (
              props.proposals.map((proposal) => <ProposalCard {...proposal} />)
            ) : (
              <EmptyState
                title="No likes yet."
                text="Support ideas and engage with the community by liking
                  proposals"
              />
            )}
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="bookmarks" pt="xs">
          <Flex
            gap="xl"
            wrap="wrap"
            justify={props.bookmarks.length === 0 ? 'center' : undefined}>
            {props.bookmarks.length > 0 ? (
              props.bookmarks.map((proposal) => <ProposalCard {...proposal} />)
            ) : (
              <EmptyState
                title="No bookmarks yet."
                text="Save great ideas you want to remember by bookmarking them"
              />
            )}
          </Flex>
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

const EmptyState = (props: { title: string; text: string }) => (
  <Stack align="center" justify="center" h="40vh" w="35%">
    <Subheading1 style={{ fontWeight: 600 }}>{props.title}</Subheading1>
    <BodyText color="#5C5C5C" style={{ textAlign: 'center' }}>
      {props.text}
    </BodyText>
  </Stack>
);

export const getStaticProps: GetStaticProps<{
  proposals: any[];
  bookmarks: any[];
  likes: any[];
  drafts: any[];
  comments: any[];
  votes: any[];
}> = () => ({
  props: {
    bookmarks: [],
    likes: [],
    drafts: [],
    comments: [],
    proposals: new Array(0).fill({}).map((_, index) => ({
      id: index.toString(),
      src: '/temp5.png',
      title:
        "I designed this cover art for Ramengvrl's EP Campaign. What do you guys think?",
    })),
    votes: new Array(0).fill({}).map(() => ({
      title:
        "I quoted one of Valtina's lyric to a merch. Should we have this for the event?",
      timestamp: Date.now(),
      amount: -1000,
      src: '/temp5.png',
    })),
  },
});

export default Profile;
