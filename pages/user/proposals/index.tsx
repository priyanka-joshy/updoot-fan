import { Flex, SegmentedControl, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import PCCard from '@components/PCCard';
import Button from '@components/button';
import { Heading2, Subheading1 } from '@components/typography';
import { Bookmark, Campaign, Proposal } from 'src/utils/types';
import api from 'src/utils/api';
import { useAuth } from 'src/utils/auth/authContext';
import { NextPage } from 'next';

const filters = [
  'Newest',
  'Artist Campaigns',
  'Ending Soon',
  'Trending',
] as const;

const showTypes = ['Proposals', 'Campaigns'] as const;

const Proposals: NextPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<typeof filters[number]>('Newest');
  const [showType, setShowType] =
    useState<typeof showTypes[number]>('Proposals');
  const [filteredPC, setFilteredPC] = useState<Proposal[] | Campaign[]>([]);
  const [campaigns, setCampaigns] = useState<Proposal[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  if (!user) return null;

  useEffect(() => {
    const getPageData = async () => {
      const bookmarkRes = await api.user.get(
        `/bookmark/${user.attributes.email}`
      );
      const campaignRes = await api.campaign.get('/all');
      const ProposalRes = await api.proposal.get('/all');
      setFilteredPC(ProposalRes.message.proposalList);
      setCampaigns(campaignRes.message.campaignList);
      setBookmarks(bookmarkRes.message.bookmark);
      console.log(bookmarkRes.message);
    };
    getPageData();
  }, []);

  useEffect(() => {
    const PC = showType === 'Proposals' ? filteredPC : campaigns;
    switch (filter) {
      case 'Newest':
        setFilteredPC(
          PC!.sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0))
        );
        break;
      case 'Ending Soon':
        setFilteredPC(PC!.sort((a, b) => (a.endTime ?? 0) - (b.endTime ?? 0)));
        break;
      case 'Trending':
        setFilteredPC(
          PC!.sort((a, b) => (a.likes?.length ?? 0) - (b.likes?.length ?? 0))
        );
        break;
    }
  }, [filter, showType]);

  return (
    <Stack>
      <Heading2>Entertainment 3.0 starts here</Heading2>
      <Subheading1>Discover Proposals</Subheading1>
      <Flex gap="md" my="md" align="center">
        {filters.map((value) => (
          <Button
            size="sm"
            color="black"
            type={filter === value ? 'primary' : 'secondary'}
            onClick={() => setFilter(value)}
            key={value}>
            {value}
          </Button>
        ))}
        <SegmentedControl
          ml="auto"
          data={[...showTypes]}
          onChange={(type: typeof showTypes[number]) => setShowType(type)}
        />
      </Flex>
      <Flex gap="xl" wrap="wrap">
        {filteredPC!.map((pc, key) => (
          <PCCard
            key={key}
            {...pc}
            bookmarked={
              showType === 'Proposals'
                ? bookmarks?.proposalBookmarks?.includes(pc._id)
                : bookmarks?.campaignBookmarks?.includes(pc._id)
            }
          />
        ))}
      </Flex>
    </Stack>
  );
};

// export const getServerSideProps: GetServerSideProps<{
//   bookmark: Bookmark;
//   campaigns: Campaign[];
//   proposals: Proposal[];
// }> = async (context) => {
//   const SSR = withSSRContext(context);
//   const { email } = (await SSR.Auth.currentAuthenticatedUser()).attributes;
//   const bookmarkRes = await api.user.get(`/bookmark/${email}`);
//   console.log(bookmarkRes);
//   const campaignRes = await api.campaign.get('/all');
//   const proposalRes = await api.proposal.get('/all');
//   return {
//     props: {
//       bookmark: bookmarkRes.message.bookmark,
//       campaigns: campaignRes.message.campaignList,
//       proposals: proposalRes.message.proposalList,
//     },
//   };
// };

export default Proposals;
