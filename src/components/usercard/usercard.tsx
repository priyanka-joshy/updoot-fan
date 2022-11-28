import { Flex, Grid, GridProps, Stack, Text } from '@mantine/core';

import styles from './usercard.module.scss';

interface UserCardProps {
  name: string;
  level?: number;
  address?: string;
  avatar: string;
  outline?: boolean;
}

const UserCard = (props: UserCardProps & Partial<GridProps>) => {
  return (
    <Flex className={props.outline ? styles.container : undefined}>
      <Grid align="center" justify="center" {...props} columns={12}>
        <Grid.Col
          lg={props.outline ? 4 : undefined}
          span={props.columns ? 12 / props.columns : 7}>
          <img src={props.avatar} className={styles.avatar} />
        </Grid.Col>
        <Grid.Col
          lg={props.outline ? 8 : undefined}
          span={props.columns ? 12 / props.columns : 7}>
          <Stack spacing={0} align={props.outline ? undefined : 'center'}>
            <Text style={{ whiteSpace: 'nowrap' }}>{props.name}</Text>
            {props.address === undefined ? (
              <Text className={styles.level}>Lv.{props.level}</Text>
            ) : (
              props.address && (
                <Text className={styles.address}>{props.address}</Text>
              )
            )}
          </Stack>
        </Grid.Col>
      </Grid>
    </Flex>
  );
};

export default UserCard;
