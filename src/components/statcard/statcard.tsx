import { Flex, FlexProps, Text } from '@mantine/core';
import { IconType } from 'react-icons/lib';
import styles from './statcard.module.scss';

interface StatCard extends FlexProps {
  data: string | number;
  description: string;
  icon?: JSX.Element;
}

const StatCard = (props: StatCard) => {
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
