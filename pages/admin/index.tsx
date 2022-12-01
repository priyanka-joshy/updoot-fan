import { NextPage } from 'next';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Box, Button, Flex, Stack, Text } from '@mantine/core';

import UserCard from '@components/userInfo';
import styles from 'styles/admin/index.module.scss';
import AdminInfoBox from '@components/adminInfoBox';

Chart.register(LinearScale, CategoryScale, PointElement, LineElement, Filler);

const data: ChartData<'line'> = {
  labels: new Array(24).fill(0).map((_, index) => index),
  datasets: [
    {
      label: 'Users',
      data: new Array(24)
        .fill(0)
        .map(() => Math.floor(Math.random() * 20 + 200)),
      fill: true,
      borderColor: '#3751FF',
      backgroundColor: '#3751FF10',
      pointBackgroundColor: '#3751FF',
    },
    {
      label: 'Token Transactions',
      data: new Array(24)
        .fill(0)
        .map(() => Math.floor(Math.random() * 20 + 200)),
      borderColor: '#DFE0EB',
    },
  ],
};

const options: ChartOptions<'line'> = {
  responsive: true,
  elements: { line: { cubicInterpolationMode: 'monotone' } },
  scales: {
    y: { position: 'right' },
    x: { grid: { display: false } },
  },
};

const Dashboard: NextPage = () => {
  return (
    <Flex wrap="wrap" gap="sm" miw="fit-content">
      <Stack w="75%" miw="fit-content">
        <Flex className={styles.container}>
          <Stack
            style={{ borderRight: '1px solid #DFE0EB' }}
            spacing="xs"
            p="md"
            w="70%">
            <Flex align="center" justify="space-between" wrap="wrap">
              <Text weight={700} size={20}>
                Today's trends
              </Text>
              <Flex gap="xs" wrap="wrap">
                <Button variant="light" color="gray" size="xs" radius="xl">
                  View 7 Days Trend
                </Button>
                <Button variant="light" color="gray" size="xs" radius="xl">
                  View 30 Days Trend
                </Button>
                <Button variant="light" color="gray" size="xs" radius="xl">
                  View 6 Months Trend
                </Button>
              </Flex>
            </Flex>
            <Text color={'#878787'} size={12}>
              as of {new Date(1e13).toLocaleString()}
            </Text>
            <Line options={options} data={data} />
          </Stack>
          <Stack w="30%" spacing={0}>
            <Stack
              className={styles.statRow}
              justify="center !important"
              h="25% !important"
              spacing={0}>
              <Text size={16} color="#9FA2B4" align="center">
                Votes
              </Text>
              <Text weight={700} size={24}>
                4.4k
              </Text>
            </Stack>
            <Stack
              className={styles.statRow}
              justify="center !important"
              h="25% !important"
              spacing={0}>
              <Text size={16} color="#9FA2B4" align="center">
                STARDUST Vested
              </Text>
              <Text weight={700} size={24}>
                426
              </Text>
            </Stack>
            <Stack
              className={styles.statRow}
              justify="center !important"
              h="25% !important"
              spacing={0}>
              <Text size={16} color="#9FA2B4" align="center">
                Comments received
              </Text>
              <Text weight={700} size={24}>
                4.4k
              </Text>
            </Stack>
            <Stack
              className={[styles.statRow, styles.last].join(' ')}
              justify="center !important"
              h="25% !important"
              spacing={0}>
              <Text size={16} color="#9FA2B4" align="center">
                Campaign ending in
              </Text>
              <Text weight={700} size={24}>
                10 days
              </Text>
            </Stack>
          </Stack>
        </Flex>
        <Flex justify="space-between" wrap="wrap" gap="xs">
          <Stack className={styles.container} w="49%" spacing={0}>
            <Text px="lg" pt="lg" size={20} weight={700}>
              Recent Activities
            </Text>
            <Text px="lg" size={12} color="#9FA2B4" mb="1vh">
              Today
            </Text>
            {RECENT_ACTIVITIES.map((activity, index) => (
              <Flex
                justify="space-between"
                className={
                  styles.statRow +
                  (index === PERFORMERS.length - 1 ? ` ${styles.last}` : '')
                }>
                <Text size={14} style={{ whiteSpace: 'nowrap' }}>
                  {activity}
                </Text>
                <Text size={14} color="#9FA2B4">
                  3 mins
                </Text>
              </Flex>
            ))}
          </Stack>
          <Stack className={styles.container} w="49%" spacing={0}>
            <Text px="lg" pt="lg" size={20} weight={700}>
              Leaderboard
            </Text>
            <Text px="lg" size={12} color="#9FA2B4" mb="1vh">
              Today
            </Text>
            {PERFORMERS.map((performer, index) => (
              <Flex
                justify="space-between"
                className={
                  styles.statRow +
                  (index === PERFORMERS.length - 1 ? ` ${styles.last}` : '')
                }>
                <UserCard {...performer} columns={2} w="10rem" p={0} />
                {/*TODO: make that dynamic*/}
                <Box
                  style={{ background: '#29CC97', borderRadius: 8 }}
                  px="sm"
                  py={2}>
                  <Text size={12} w={50} align="center" color={'#ffffff'}>
                    NEW
                  </Text>
                </Box>
              </Flex>
            ))}
          </Stack>
        </Flex>
      </Stack>
      <Stack align="center" sx={{ flex: 1 }}>
        {[
          { title: 'Pending Approval', data: 16, variant: 'danger' },
          { title: 'Pending Comments', data: 60 },
          { title: 'New Transactions', data: 15 },
        ].map((v) => (
          <AdminInfoBox {...v} />
        ))}
      </Stack>
    </Flex>
  );
};

const RECENT_ACTIVITIES = [
  '5 users have commented for DJ Soda.',
  'Universal Music has received in 1 day!',
  "Empira's DAO has reached 100 votes!",
  'Congrats! Your campaign is gaining tractions.',
];

const PERFORMERS = [
  {
    name: 'DJ Soda',
    avatar:
      'https://img.freepik.com/free-vector/' +
      'cute-rabbit-with-duck-working-laptop-' +
      'cartoon-illustration_56104-471.jpg?w=2000',
  },
  {
    name: 'Empira',
    avatar:
      'https://img.freepik.com/free-vector/' +
      'cute-rabbit-with-duck-working-laptop-' +
      'cartoon-illustration_56104-471.jpg?w=2000',
  },
  {
    name: 'DJ Soda',
    avatar:
      'https://img.freepik.com/free-vector/' +
      'cute-rabbit-with-duck-working-laptop-' +
      'cartoon-illustration_56104-471.jpg?w=2000',
  },
  {
    name: 'Empira',
    avatar:
      'https://img.freepik.com/free-vector/' +
      'cute-rabbit-with-duck-working-laptop-' +
      'cartoon-illustration_56104-471.jpg?w=2000',
  },
];

export default Dashboard;
