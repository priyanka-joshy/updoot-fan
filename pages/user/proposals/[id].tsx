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
  TbBookmark,
  TbCheck,
  TbChevronLeft,
  TbChevronRight,
  TbChevronUp,
  TbHandStop,
  TbShare,
} from 'react-icons/tb';
import { WiStars } from 'react-icons/wi';
import styles from 'styles/user/proposals/index.module.scss';
import { withSSRContext } from 'aws-amplify';

import {
  TokCtrtWithoutSplit,
  Chain,
  ChainID,
  NodeAPI,
} from '@virtualeconomy/js-vsys';

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
import { TEST_NET, STARDUST_CTRT_ID } from 'src/utils/constants';
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
  const [successModalOpened, setSuccessModalOpened] = useState(false);
  const [imageModalOpened, setImageModalOpened] = useState(false);
  const [successCommentModal, setSuccessCommentModal] = useState(false);
  const [commentContent, setCommentContent] = useState('');

  const router = useRouter();

  const sortedComments = props.comments.sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
  );

  const getDateDifferenceHours = (date: string) => {
    let diffTime = Math.abs(new Date().valueOf() - new Date(date).valueOf());
    let days = diffTime / (24 * 60 * 60 * 1000);
    let hours = (days % 1) * 24;
    let minutes = (hours % 1) * 60;
    let secs = (minutes % 1) * 60;
    [days, hours, minutes, secs] = [
      Math.floor(days),
      Math.floor(hours),
      Math.floor(minutes),
      Math.floor(secs),
    ];
    //format datestring per specs
    let dateString = '';
    if (days > 0) {
      dateString = `${days ? `${days}days` : ''} ago`;
    } else if (hours > 0) {
      dateString = `${hours ? `${hours}hours` : ''} ago`;
    } else {
      dateString = `${minutes ? `${minutes}minutes` : ''} ago`;
    }

    return dateString;
  };
  return (
    <div>
      <Modal
        opened={imageModalOpened}
        size="50vh"
        padding={0}
        onClose={() => setImageModalOpened(false)}>
        <Carousel>
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
        </Carousel>
      </Modal>
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
              required
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

          <Button
            style={{ width: '90%', margin: '1rem' }}
            onClick={() => {
              setModalOpened(false);
              setSuccessModalOpened(true);
            }}>
            <TbHandStop />
            Vote Now
          </Button>
        </Stack>
      </Modal>

      <Modal
        centered={true}
        radius={'xl'}
        opened={successModalOpened}
        onClose={() => setModalOpened(false)}>
        <Stack align={'center'}>
          <TbCheck color="#6200FF" size={36} />
          <Heading3 style={{ fontWeight: '600' }}>
            Thank You For Voting!
          </Heading3>
          <Button
            style={{ width: '90%', margin: '1rem' }}
            onClick={() => router.back()}>
            <TbHandStop />
            Back to Discover
          </Button>
        </Stack>
      </Modal>

      <Modal
        centered={true}
        radius={'xl'}
        opened={successCommentModal}
        onClose={() => setSuccessCommentModal(false)}>
        <Stack align={'center'} justify={'center'}>
          <TbCheck color="#6200FF" size={50} />
          <Heading3 style={{ fontWeight: '600', textAlign: 'center' }}>
            Your Comment Has Been Submitted. Please wait for approval.
          </Heading3>
          <Button
            style={{ width: '90%', margin: '1rem' }}
            onClick={() => setSuccessCommentModal(false)}>
            <TbHandStop />
            Back
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
                <Subheading1 color="#A1A1A1">
                  {props.comments.length} comments
                </Subheading1>
              </Flex>
              <Flex align={'center'} gap="sm">
                <img
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                  src="/temp2.png"
                />
                <Subheading2>{props.username}</Subheading2>
              </Flex>
              <Textarea
                radius="md"
                placeholder="What do you think?"
                size="xl"
                onChange={(e) => {
                  setCommentContent(e.target.value);
                }}
              />
              <Button
                type="secondary"
                color="black"
                style={{
                  marginLeft: 'auto',
                  marginRight: '0',
                }}
                onClick={async () => {
                  const body: Partial<Comment> = {
                    content: commentContent,
                    type: 'Proposal',
                    typeId: props._id,
                    username: props.username,
                  };
                  const res = await api.comment.post('/create', body);
                  setSuccessCommentModal(true);
                }}>
                Comment
              </Button>
              {sortedComments.map((item) => (
                <Stack spacing={'sm'} style={{ marginBottom: '1rem' }}>
                  <Flex align={'center'} gap="sm">
                    {item.image ? (
                      <img className={styles.avatarImage} src={item.image} />
                    ) : (
                      <img
                        className={styles.avatarImage}
                        src={'/authPageLogo.svg'}
                      />
                    )}

                    <Subheading2>{item.username}</Subheading2>
                    <BodyText color="#CCCCCC">
                      {getDateDifferenceHours(item.createdAt)}
                    </BodyText>
                  </Flex>
                  <BodyText>{item.content}</BodyText>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col
          md={4}
          style={{ position: 'fixed', right: '2rem', top: '4rem' }}>
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
                    data={`${props.votes} users`}
                    description="Users have voted"
                    icon={<FiCheckCircle size={30} color="#6200FF" />}
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
                  <Stack>
                    <StatCard
                      data={props.sponsors.length}
                      description="Proposal Sponsors"
                      icon={<FiUserCheck size={36} color="#6200FF" />}
                    />
                    <Flex align={'center'} gap="md">
                      {props.sponsors.map((sponsor, index) => (
                        <img
                          className={styles.avatarImage}
                          src={'/Comment-avatar-1.png'}
                        />
                      ))}
                      <UnstyledButton
                        style={{
                          marginRight: 'auto',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                        onClick={() => router.replace('/user/proposals')}>
                        See More
                        <TbChevronRight size={20} />
                      </UnstyledButton>
                    </Flex>
                  </Stack>
                </Grid.Col>
              </Grid>

              <Stack style={{ paddingTop: '2rem' }} spacing="lg">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
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
                    <TbBookmark />
                    Bookmark
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
  Proposal & { comments: any[]; balance: number; username: string },
  Params
> = async (context) => {
  const { id } = context.params!;
  const proposal = await api.proposal.get(`/${id}`);
  const comments = await api.proposal.get(`/comments/${id}`);
  const SSR = withSSRContext(context);
  const { name } = (await SSR.Auth.currentAuthenticatedUser()).attributes;
  const { message: user } = await api.user.get(`/getUserByUsername/${name}`);
  const nodeApi = NodeAPI.new(TEST_NET);
  const chainId = new ChainID('TEST_NET', ChainID.elems.TEST_NET);
  const chain = new Chain(nodeApi, chainId);
  const stardustContract = new TokCtrtWithoutSplit(STARDUST_CTRT_ID, chain);
  const balance = await stardustContract.getTokBal(user.walletAddress);
  // get sponsor list
  // do stardust transaction
  return {
    props: {
      ...proposal.message,
      balance: +balance.data,
      username: name,
      id: id,
      comments: comments.message.comments,
      sponsors: [
        {
          _id: '1',
          brand: "Spinnin' Asia",
          companyId: "Spinnin' Asia",
          name: 'Emma Smith',
          image: '/Comment-avatar-1.png',
        },
        {
          _id: '2',
          brand: 'warner Music',
          companyId: 'Warner Bros Music',
          name: 'Satish Patel',
          image: '/Comment-avatar-1.png',
        },
        {
          _id: '3',
          brand: 'Starship Entertainment',
          companyId: 'Starship Entertainment',
          name: 'Hannah Lane',
          image: '/Comment-avatar-1.png',
        },
      ],
    },
  };
};

export default Proposal;
