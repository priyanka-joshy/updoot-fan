import { useState } from 'react';
import { useRouter } from 'next/router';
import { FlexProps, Text } from '@mantine/core';

import styles from './styles.module.scss';

interface IProps extends FlexProps {
  data: string | number;
  description: string;
  icon?: JSX.Element;
}

const StatCard = (props: IProps) => {
  return (
    <div className={styles.container} {...props}>
      {props.icon}
      <Text weight={600} size={24} align="center">
        {props.data.toString()}
      </Text>
      <Text color="#5C5C5C">{props.description}</Text>
    </div>
  );
};

export default StatCard;
