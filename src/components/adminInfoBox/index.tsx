import { Text, UnstyledButton } from '@mantine/core';
import React from 'react';
import styles from './styles.module.scss';

interface IProps {
  title: string;
  data: string | number;
  variant?: string;
}

const AdminInfoBox = (props: IProps) => {
  const getClassName = () => {
    switch (props.variant) {
      case 'danger':
        return { classname: styles.infoBoxDanger };
      case 'default':
      default:
        return { classname: styles.infoBox, color: '#9FA2B4' };
    }
  };

  return (
    <div className={getClassName().classname}>
      <Text weight={700} size={20} color={getClassName().color}>
        {props.title}
      </Text>
      <Text weight={700} size={40}>
        {props.data}
      </Text>
      <UnstyledButton>
        <Text>Review</Text>
      </UnstyledButton>
    </div>
  );
};

export default AdminInfoBox;
