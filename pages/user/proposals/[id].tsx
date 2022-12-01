import { Button, Flex, Grid, Stack, Text, Title } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { FiShare, FiHeart, FiUserCheck } from 'react-icons/fi';
import { BiCommentDetail, BiLike, BiTimeFive } from 'react-icons/bi';
import { WiStars } from 'react-icons/wi';
import StatCard from '@components/statCard';

interface Params extends ParsedUrlQuery {
  id: string;
}

interface ProposalStats {
  topic: string;
  title: string;
  description: string;
  likes: number;
  shares: number;
  votes: number;
  stardust: number;
  expiration: EpochTimeStamp;
}

const getDateDifference = (expiration: EpochTimeStamp) => {
  const date = new Date(expiration - Date.now());
  return `${date.getDay()}d ${date.getHours()}h ${date.getMinutes()}m`;
};

const Proposal: NextPage<ProposalStats> = (props) => {
  return (
    <div>
      <Title order={2}>{props.topic}</Title>
      <Grid>
        <Grid.Col md={6}>
          <Flex direction="column" h="100%">
            <Text weight={600} mt="sm">
              Details
            </Text>
            <Flex gap="sm" my="lg" wrap="wrap">
              <Button
                w="8.5rem"
                variant="outline"
                color="red"
                leftIcon={<FiHeart fill="currentColor" />}
                radius="lg">
                {props.likes} Likes
              </Button>
              <Button
                w="8.5rem"
                variant="outline"
                color="dark"
                leftIcon={<FiShare />}
                radius="lg">
                {props.shares} Shares
              </Button>
              <Button
                w="8.5rem"
                variant="outline"
                color="dark"
                leftIcon={<BiCommentDetail />}
                radius="lg">
                {props.votes} Votes
              </Button>
              <Button w="8.5rem" color="dark" radius="lg">
                Vote Now
              </Button>
            </Flex>
            <Title order={2}>{props.title}</Title>
            <Text
              color="#5C5C5C"
              my="lg"
              style={{
                border: '1px solid #CCCCCC',
                borderRadius: 10,
                padding: '1rem',
              }}>
              {props.description}
            </Text>
            <Flex h={120} justify="space-between">
              {['/temp4.png', '/temp5.png'].map((src, _, arr) => (
                <img
                  width={`${100 / arr.length - 1}%`}
                  height="100%"
                  src={src}
                />
              ))}
            </Flex>
            <Carousel
              mt="lg"
              height={120}
              align="start"
              slideSize="33.333333%"
              slideGap="md"
              loop>
              {[
                '/temp1.png',
                '/temp2.png',
                '/temp3.png',
                '/temp4.png',
                '/temp5.png',
              ].map((src) => (
                <Carousel.Slide
                  style={{ justifyContent: 'center', display: 'flex' }}>
                  <img height="100%" src={src} style={{ aspectRatio: 1 }} />
                </Carousel.Slide>
              ))}
            </Carousel>
          </Flex>
        </Grid.Col>
        <Grid.Col md={2}>
          <Text weight={600}>Stats</Text>
          <Stack spacing="lg" mt="lg">
            <StatCard
              data={props.stardust}
              description="Stardust collected"
              icon={<WiStars size={36} color="#6200FF" />}
            />
            <StatCard
              data={'67%'}
              description="Approval rate"
              icon={<BiLike size={30} color="#6200FF" />}
            />
            <StatCard
              data={`${props.votes} users`}
              description="Proposal sponsors"
              icon={<FiUserCheck size={30} color="#6200FF" />}
            />
            <StatCard
              data={getDateDifference(props.expiration)}
              description="End of voting"
              icon={<BiTimeFive size={30} color="#6200FF" />}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col md={4}></Grid.Col>
      </Grid>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ProposalStats, Params> = async (
  context
) => {
  const { id } = context.params!;
  return {
    props: {
      id,
      topic: 'RAMENGVRL EP Campaign',
      title:
        "I created designed this cover art for Ramengvrl's " +
        'EP Campaign. What do you guys think?',
      description:
        'I loved this idea of a fan-collaborative project ' +
        'and decided to create my own design for her EP cover. ' +
        'The idea is inspired by the versatality of RAMENGVRL, ' +
        'therefore I created this collage and think could be ' +
        'a great idea for her EP cover. I hand draw each image ' +
        'with watercolor and scanned it digitally. Visually ' +
        'it matches the EP theme and has this dynamic exposure ' +
        'of color. I have also included several variaions...',
      likes: 530,
      shares: 290,
      votes: 410,
      stardust: 80000,
      expiration: Date.now() + 1e7,
    },
  };
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  return {
    paths: new Array(10000).fill(undefined).map((_, id) => ({
      params: { id: id.toString() },
    })),
    fallback: false,
  };
};

export default Proposal;
