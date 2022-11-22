import { Box, Flex, Grid, Text } from '@mantine/core';
import styles from './sponsor.module.scss';

interface SponsorProps {
  name: string;
  level: number;
  avatar: string;
}

const Sponsor = (props: SponsorProps) => {
  return (
    <Flex className={styles.container}>
      <Grid align="center">
        <Grid.Col md={4}>
          <img src={props.avatar} className={styles.avatar} />
        </Grid.Col>
        <Grid.Col md={8}>
          <Box>
            <Text>{props.name}</Text>
            <Text className={styles.level}>Lv.{props.level}</Text>
          </Box>
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default Sponsor;
