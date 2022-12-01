import {
  Box,
  Divider,
  Flex,
  Grid,
  Progress,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { NextPage } from 'next';

import styles from 'styles/profile.module.scss';

const Profile: NextPage = () => {
  return (
    <div>
      <Grid>
        <Grid.Col md={6}>
          <Title order={2}>Profile</Title>
          <Text color="#A1A1A1">Manage your assets and activity</Text>
          <Flex align="flex-end" mt="lg">
            <img
              className={styles.avatar}
              src="https://www.cityu.edu.hk/sro/AboutStudentResidence/ResidenceHalls/SR06/SR06_301A_56279462_KOZHIN,Assan.jpg"
            />
            <Stack spacing={5} w="65%">
              <Text weight={600}>Assan Kozhin</Text>
              <Stack className={styles.outline}>
                <Text>Level 99</Text>
                <Progress color="dark" radius="xl" size="lg" value={70} />
              </Stack>
            </Stack>
          </Flex>
        </Grid.Col>
        <Grid.Col md={6}>
          <Flex className={styles.outline} align="center" wrap="wrap">
            <Stack spacing={0}>
              <Text weight={600}>Stardust Wallet</Text>
              <Text weight={600} size={30}>
                99999
              </Text>
            </Stack>
            <RingProgress
              sections={[
                { value: 70, color: '#FFD633' },
                { value: 30, color: '#FF3366' },
              ]}
            />
            <Stack spacing={5} style={{ flex: 1 }}>
              <Flex justify="space-between">
                <Flex gap="md" align="center">
                  <Box bg="#FFD633" className={styles.indicator} />
                  <Stack spacing={0}>
                    <Text weight={600}>Total</Text>
                    <Text color="#616161">70%</Text>
                  </Stack>
                </Flex>
                <Text weight={600} size={24}>
                  70000$SD
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Flex gap="md" align="center">
                  <Box bg="#FF3366" className={styles.indicator} />
                  <Stack spacing={0}>
                    <Text weight={600}>Contributed</Text>
                    <Text color="#616161">30%</Text>
                  </Stack>
                </Flex>
                <Text weight={600} size={24}>
                  30000$SD
                </Text>
              </Flex>
            </Stack>
          </Flex>
          <Flex className={styles.outline} justify="space-between" mt="sm">
            <Text weight={600}>Sponsor Request</Text>
            <Text weight={300} color={'#9FA2B4'}>
              No pending sponsor projects
            </Text>
          </Flex>
        </Grid.Col>
      </Grid>
      <Divider color="#CCCCCC" my="xl" />
    </div>
  );
};

export default Profile;
