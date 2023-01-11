import { BodyText, Subheading1 } from '@components/typography';
import VoteRow from '@components/voteRow';
import { Flex, Loader, Stack } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import api from 'src/utils/api';
import { useAuth } from 'src/utils/auth/authContext';
import { VOTE_COST } from 'src/utils/constants';
import { getUploadedFile } from 'src/utils/storage';
import { Proposal, Vote } from 'src/utils/types';

interface UserVote {
  title: string;
  timestamp: EpochTimeStamp;
  amount: number;
  src: string;
}
const EmptyState = (props: { title: string; text: string }) => (
  <Stack align="center" justify="center" h="40vh" w="35%">
    <Subheading1 style={{ fontWeight: 600 }}>{props.title}</Subheading1>
    <BodyText color="#5C5C5C" style={{ textAlign: 'center' }}>
      {props.text}
    </BodyText>
  </Stack>
);

export const UserVotes = () => {
  const { user } = useAuth();
  const [votesData, setVotesData] = useState<(UserVote | undefined)[]>();

  useEffect(() => {
    const getData = async () => {
      const { message: data }: { message: { votes: Vote[] } } =
        await api.user.get(`/vote/getAllVotes/${user!.attributes.name}`);
      // get proposal information - title and title image for each vote
      const userVotes: (UserVote | undefined)[] = await Promise.all(
        data.votes.map(async (vote) => {
          const {
            status,
            message: proposalData,
          }: { status: string; message: Proposal } = await api.proposal.get(
            `/${vote.typeId}`
          );
          if (status === 'Success') {
            // get title image from s3 bucket
            const urlRes =
              proposalData.titleImage &&
              (await getUploadedFile(proposalData.titleImage));

            // TODO: handle no image error
            const imageURL = !urlRes || urlRes instanceof Error ? '' : urlRes;

            return {
              title: proposalData.title,
              timestamp: vote.timestamp,
              amount: 0 - VOTE_COST,
              src: imageURL,
            };
          }
        })
      );
      setVotesData(userVotes);
    };
    getData();
  }, []);

  if (!votesData)
    return (
      <Flex justify="center">
        <Loader color="violet" />
      </Flex>
    );
  return (
    <>
      {votesData.length > 0 ? (
        votesData.map(
          (voteData) =>
            voteData && (
              <VoteRow
                {...voteData}
                key={voteData.title + '-' + voteData.timestamp}
              />
            )
        )
      ) : (
        <Flex justify="center">
          <EmptyState
            title="No votes yet."
            text="Actively drive ideas by voting on proposals"
          />
        </Flex>
      )}
    </>
  );
};
