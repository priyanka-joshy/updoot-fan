import { Flex, FlexProps, Text } from '@mantine/core';

import styles from './statcard.module.scss';

interface StatCardProps extends FlexProps {
  data: string | number;
  description: string;
  icon?: JSX.Element;
}

const StatCard = (props: StatCardProps) => {
  return (
    <Flex className={styles.container} {...props}>
      {props.icon}
      <Text weight={600} size={24} align="center">
        {props.data.toString()}
      </Text>
      <Text color="#5C5C5C" align="center">
        {props.description}
      </Text>
    </Flex>
  );
};

export default StatCard;
