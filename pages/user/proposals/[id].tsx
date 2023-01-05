import { useState } from 'react';
import {
  Modal,
  Checkbox,
  Flex,
  Grid,
  Stack,
  Title,
  Textarea,
  Anchor,
  UnstyledButton,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';

import { ParsedUrlQuery } from 'querystring';
import { FiCheckCircle, FiHeart, FiUserCheck } from 'react-icons/fi';
import { BiLike, BiTimeFive } from 'react-icons/bi';
import {
  TbChevronLeft,
  TbChevronUp,
  TbHandStop,
  TbShare,
} from 'react-icons/tb';
import { WiStars } from 'react-icons/wi';
import { withSSRContext } from 'aws-amplify';

import StatCard from '@components/statCard';
import {
  BodyText,
  Heading3,
  Subheading1,
  Subheading2,
} from '@components/typography';
import Button from '@components/button';
import { Proposal, Comment } from 'src/utils/types';
import api from 'src/utils/api';
import { getProfilePicture } from 'src/utils/storage';
import getWalletBalance from 'src/utils/getWalletBalance';

interface Params extends ParsedUrlQuery {
  id: string;
}

const getDateDifference = (expiration: EpochTimeStamp) => {
  const date = new Date(expiration - Date.now());
  return `${date.getDay()}d ${date.getHours()}h ${date.getMinutes()}m`;
};

const Proposal: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const [balance, setBalance] = useState(props.balance);
  const [modalOpened, setModalOpened] = useState(false);
  const router = useRouter();

  return (
    <div>
      <Modal
        centered={true}
        radius={'xl'}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}>
        <Stack align={'center'}>
          <TbHandStop color="#6200FF" size={36} />
          <Heading3 style={{ fontWeight: '600' }}>Cast your vote!</Heading3>
          <Subheading1>Votes require Stardust to be valid</Subheading1>
          <Stack
            spacing={'sm'}
            style={{
              borderRadius: '1rem',
              border: '1px solid #DFE0EB',
              padding: '1rem',
              marginTop: '2.5rem',
              width: '90%',
            }}>
            <Flex justify={'space-between'}>
              <BodyText>Stardust Balance</BodyText>
              <BodyText>{balance}SD</BodyText>
            </Flex>
            <Flex justify={'space-between'}>
              <BodyText>Payment amount</BodyText>
              <BodyText style={{ fontWeight: '700' }}>{-1000}SD</BodyText>
            </Flex>
            <Flex
              justify={'space-between'}
              style={{ borderTop: '1px solid #DFE0EB', paddingTop: '1rem' }}>
              <BodyText>Balance after payment</BodyText>
              <BodyText>{balance - props.costPerVote}SD</BodyText>
            </Flex>
          </Stack>
          <Stack style={{ width: '80%', padding: '1rem 0' }}>
            <Subheading1>Confirm Payment</Subheading1>
            <Checkbox
              color="violet"
              radius={'xl'}
              label={
                <>
                  By clicking “Vote now”, you confirm that you have read,
                  understand, and accepted our{' '}
                  <Anchor
                    size="sm"
                    href="https://mantine.dev"
                    target="_blank"
                    color="black"
                    underline={true}>
                    Terms of Use
                  </Anchor>
                  .
                </>
              }
            />
          </Stack>

          <Button style={{ width: '90%', margin: '1rem' }}>
            <TbHandStop />
            Vote Now
          </Button>
        </Stack>
      </Modal>
      <Grid gutter={'xl'} style={{ padding: '1rem' }}>
        <Grid.Col md={7} style={{ marginRight: '2rem' }}>
          <Stack spacing={30}>
            <UnstyledButton
              style={{
                marginRight: 'auto',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
              }}
              onClick={() => router.back()}>
              <TbChevronLeft size={20} />
              Back
            </UnstyledButton>
            <img
              style={{ height: '15rem', width: '100%', borderRadius: '10px' }}
              src={'/temp5.png'}
            />
            <Flex justify={'space-between'}>
              <Subheading1>Proposals</Subheading1>
              <Subheading1 color="#A1A1A1">Ends in 3 Days</Subheading1>
            </Flex>
            <Title order={2}>{props.title}</Title>
            <BodyText
              color="#5C5C5C"
              style={{
                borderRadius: 10,
                textAlign: 'left',
              }}>
              {props.details}
            </BodyText>

            <Carousel
              mt="lg"
              style={{ padding: '0 rem' }}
              height="15vh"
              align="start"
              slideSize="25%"
              controlsOffset={'xs'}
              slideGap={1}
              previousControlIcon={<TbChevronLeft size={16} />}
              loop={true}>
              <Carousel.Slide size="50%">
                <img
                  height="100%"
                  src={'/temp5.png'}
                  style={{ width: '100%', borderRadius: '10px' }}
                />
              </Carousel.Slide>
              {['/temp1.png', '/temp2.png', '/temp3.png'].map((src) => (
                <Carousel.Slide
                  style={{ justifyContent: 'center', display: 'flex' }}>
                  <img
                    height="100%"
                    style={{
                      border: '1px solid #CCCCCC',
                      borderRadius: '10px',
                    }}
                    src={src}
                  />
                </Carousel.Slide>
              ))}
            </Carousel>
            <div style={{ paddingTop: '5rem' }}>
              <hr
                style={{
                  borderTop: '0.5px solid #A1A1A1',
                }}
              />
            </div>
            <Stack spacing={'lg'} style={{ padding: '0 2rem' }}>
              <Flex justify={'space-between'}>
                <Subheading1>Join the Conversation!</Subheading1>
                <Subheading1 color="#A1A1A1">60 Comments</Subheading1>
              </Flex>
              <Flex align={'center'} gap="sm">
                <img
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  src="/temp2.png"
                />
                <Subheading2>Johndoe1234</Subheading2>
              </Flex>
              <Textarea
                radius="md"
                placeholder="What do you think?"
                size="xl"
              />
              <Button
                type="secondary"
                color="black"
                style={{
                  marginLeft: 'auto',
                  marginRight: '0',
                }}>
                Comment
              </Button>

              {props.comments.map((comment) => (
                <Stack spacing={'sm'} style={{ marginBottom: '1rem' }}>
                  <Flex align={'center'} gap="sm">
                    <img
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                      }}
                      src={''}
                    />
                    <Subheading2>{comment.username}</Subheading2>
                    <BodyText color="#CCCCCC">{comment.timestamp}</BodyText>
                  </Flex>
                  <BodyText>{comment.content}</BodyText>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col
          md={4}
          style={{ position: 'fixed', right: '2rem', top: '7.5rem' }}>
          <Stack h="100%" spacing={0}>
            <Stack spacing="lg" mt="lg" style={{ flex: 1 }}>
              <Grid grow gutter="sm">
                <Grid.Col span={6}>
                  <StatCard
                    data={(props.votes ?? 0) * props.costPerVote}
                    description="Collected Stardust"
                    icon={<WiStars size={36} color="#6200FF" />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <StatCard
                    data={'67%'}
                    description="Approval Rate"
                    color="#F0F0F0"
                    icon={<BiLike size={36} color="#6200FF" />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <StatCard
                    data={props.sponsors.length}
                    description="Proposal Sponsors"
                    icon={<FiUserCheck size={36} color="#6200FF" />}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <StatCard
                    data={'D-3'}
                    description={`${getDateDifference(
                      props.endTime ?? 1671069695
                    )} left to vote`}
                    icon={<BiTimeFive size={36} color="#6200FF" />}
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <StatCard
                    data={`${props.votes} users`}
                    description="Users have voted"
                    icon={<FiCheckCircle size={30} color="#6200FF" />}
                  />
                </Grid.Col>
              </Grid>

              <Stack style={{ paddingTop: '2rem' }} spacing="lg">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    width: '100%',
                    gap: '1rem',
                  }}>
                  <Button
                    color="black"
                    type="secondary"
                    style={{
                      width: '100%',
                    }}>
                    <FiHeart />
                    Like
                  </Button>
                  <Button
                    color="black"
                    type="secondary"
                    style={{
                      width: '100%',
                    }}>
                    <TbShare />
                    Share
                  </Button>
                </div>
                <Button
                  size="lg"
                  style={{
                    width: '100%',
                    marginTop: '2rem',
                  }}
                  onClick={() => setModalOpened(true)}>
                  <TbHandStop /> Vote Now
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Grid.Col>
      </Grid>
      <UnstyledButton
        style={{
          margin: 'auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        onClick={() => {
          window.scrollTo(0, 0);
        }}>
        <TbChevronUp size={25} />
        Back Up
      </UnstyledButton>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  Proposal & {
    comments: Comment[];
    balance: number;
    username: string;
    profilePicture: string;
  },
  Params
> = async (context) => {
  const { id } = context.params!;
  const proposal = await api.proposal.get(`/${id}`);
  const SSR = withSSRContext(context);
  const { name } = (await SSR.Auth.currentAuthenticatedUser()).attributes;
  const { message: user } = await api.user.get(`/getUserByUsername/${name}`);
  const balance = await getWalletBalance(user.walletAddress);
  const commentsRes = await api.proposal.get(`/comments/${id}`);
  // get profile picture from s3 bucket
  const currentProfilePhoto = await getProfilePicture(user.profilePicture);
  return {
    props: {
      ...proposal.message,
      balance,
      username: name,
      profilePicture: currentProfilePhoto,
      comments: commentsRes.message.comments,
    },
  };
};

export default Proposal;
