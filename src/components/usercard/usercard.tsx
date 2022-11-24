import { Flex, Grid, Stack, Text } from '@mantine/core';

import styles from './usercard.module.scss';

interface SponsorProps {
  name: string;
  level: number;
  avatar: string;
  outline?: boolean;
}

const Sponsor = (props: SponsorProps) => {
  return (
    <Flex className={props.outline ? styles.container : undefined}>
      <Grid align="center" justify="center" miw="7rem">
        <Grid.Col lg={props.outline ? 4 : undefined} sm={6}>
          <img src={props.avatar} className={styles.avatar} />
        </Grid.Col>
        <Grid.Col lg={8} sm={6} miw="max-content">
          <Stack spacing={0} align={props.outline ? undefined : 'center'}>
            <Text style={{ whiteSpace: 'nowrap' }}>{props.name}</Text>
            <Text className={styles.level}>Lv.{props.level}</Text>
          </Stack>
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default Sponsor;
