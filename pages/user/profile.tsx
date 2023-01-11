import { Flex, Stack, Tabs, UnstyledButton } from '@mantine/core';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';
import { TbChevronRight } from 'react-icons/tb';

import styles from 'styles/user/profile.module.scss';
import {
  BodyText,
  Heading1,
  Heading4,
  Subheading1,
} from '@components/typography';
import PCCard from '@components/PCCard';
import Button from '@components/button';
import api from 'src/utils/api';
import { Campaign, Comment, Like, Proposal, User } from 'src/utils/types';
import { withSSRContext } from 'aws-amplify';
import { getProfilePicture, getUploadedFile } from 'src/utils/storage';
import getWalletBalance from 'src/utils/getWalletBalance';
import { UserVotes } from '@components/profileTabs/votes';
import CommentRow from '@components/commentRow';

const Profile: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const router = useRouter();

  return (
    <div style={{ height: '100vh' }}>
      <div>
        <Heading1>Profile</Heading1>
        <Subheading1>Manage your assets and activity</Subheading1>
      </div>
      <Flex
        align="center"
        gap="md"
        style={{ height: '20%', marginBlock: '2rem' }}>
        <Flex align="center" gap="md" className={styles.card}>
          <img
            className={styles.image}
            src={props.profilePicture}
            alt="Profile Picture"
          />
          <Stack spacing={0}>
            <Heading4>{props.user.username}</Heading4>
            <Subheading1>
              Joined{' '}
              {new Date(props.user.createdAt).toLocaleString('default', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Subheading1>
          </Stack>
        </Flex>
        <UnstyledButton
          className={styles.card}
          onClick={() => router.push('wallet')}>
          <Stack pr="3rem" spacing={10}>
            <Heading4>Stardust Wallet</Heading4>
            <Subheading1>
              Wallet ID:{' '}
              {props.user.walletAddress.slice(0, 8) +
                '...' +
                props.user.walletAddress.slice(-8)}
            </Subheading1>
            <Subheading1 color="#6200FF">Balance: {props.balance}</Subheading1>
          </Stack>
          <TbChevronRight size={30} />
        </UnstyledButton>
      </Flex>
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
              props.proposals.map((proposal) => (
                <PCCard {...proposal} isProposal />
              ))
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
              <>
                {props.drafts.map((draft) => (
                  <PCCard {...draft} />
                ))}
              </>
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
            props.comments.map((a) => (
              <CommentRow
                content={a.content}
                timestamp={a.createdAt}
                status={a.approval.status}
              />
            ))
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
          <UserVotes />
        </Tabs.Panel>
        <Tabs.Panel value="likes" pt="xs">
          <Flex
            gap="xl"
            wrap="wrap"
            justify={props.likes.length === 0 ? 'center' : undefined}>
            {props.likes.length > 0 ? (
              props.likes.map((proposal) => {
                return <PCCard {...proposal} isProposal />;
              })
            ) : (
              <Flex justify="center">
                <EmptyState
                  title="No likes yet."
                  text="Support ideas and engage with the community by liking
                  proposals"
                />
              </Flex>
            )}
          </Flex>
        </Tabs.Panel>
        <Tabs.Panel value="bookmarks" pt="xs">
          <Flex
            gap="xl"
            wrap="wrap"
            justify={
              props.bookmarks.proposalBookmarks.length === 0
                ? 'center'
                : undefined
            }>
            {props.bookmarks.proposalBookmarks.length > 0 ? (
              props.bookmarks.proposalBookmarks.map((proposal) => (
                <PCCard {...proposal} bookmarked isProposal />
              ))
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

export const getServerSideProps: GetServerSideProps<{
  balance: number;
  bookmarks: { campaignBookmarks: Campaign[]; proposalBookmarks: Proposal[] };
  comments: Comment[];
  likes: Proposal[];
  drafts: Proposal[];
  proposals: Proposal[];
  user: User;
  profilePicture: string;
}> = async (context) => {
  const SSR = withSSRContext(context);
  const { email, name } = (await SSR.Auth.currentAuthenticatedUser())
    .attributes;
  const { message: user } = await api.user.get(`/getUserByUsername/${name}`);
  const balance = await getWalletBalance(user.walletAddress);
  const bookmarkRes = await api.user.get(`/bookmark/${email}`);
  const commentRes = await api.comment.get(`/getByUsername/${name}`);
  const { message: likesRes }: { message: { likes: Like[] } } =
    await api.user.get(`/like/getAllLikes/${name}`);
  const proposalRes: { message: { proposalList: Proposal[] } } =
    await api.proposal.get(`/user/${email}`);

  const proposals: Proposal[] = await Promise.all(
    proposalRes.message.proposalList.map(async (proposal) => {
      const urlRes =
        proposal.titleImage && (await getUploadedFile(proposal.titleImage));
      const imageURL = !urlRes || urlRes instanceof Error ? '' : urlRes;
      return { ...proposal, titleImage: imageURL };
    })
  );

  const proposalBookmarks: Proposal[] = [];
  for (const proposalId of bookmarkRes.message.bookmark?.proposalBookmarks ??
    []) {
    const { message: proposal } = await api.proposal.get(`/${proposalId}`);
    const urlRes =
      proposal.titleImage && (await getUploadedFile(proposal.titleImage));
    const imageURL = !urlRes || urlRes instanceof Error ? '' : urlRes;
    proposalBookmarks.push({ ...proposal, titleImage: imageURL });
  }
  const campaignBookmarks: Campaign[] = [];
  for (const campaignId of bookmarkRes.message.bookmark?.campaignBookmarks ??
    []) {
    const { message: campaign } = await api.campaign.get(`/${campaignId}`);
    proposalBookmarks.push(campaign);
  }
  const { message: drafts } = await api.proposal.get(`/userDrafts/${email}`);

  const currentProfilePhoto = await getProfilePicture(user.profilePicture);
  // Likes Tab
  const proposalLikes = await Promise.all(
    likesRes.likes.map(async (userLike) => {
      const { message: proposal }: { message: Proposal } =
        await api.proposal.get(`/${userLike.typeId}`);

      const urlRes =
        proposal.titleImage && (await getUploadedFile(proposal.titleImage));
      const imageURL = !urlRes || urlRes instanceof Error ? '' : urlRes;
      return { ...proposal, titleImage: imageURL };
    })
  );

  return {
    props: {
      balance,
      bookmarks: { proposalBookmarks, campaignBookmarks },
      comments: commentRes.message.comment,
      likes: proposalLikes,
      profilePicture: currentProfilePhoto,
      proposals: proposals,
      drafts: drafts.proposalList,
      user,
    },
  };
};

export default Profile;
