import { Flex, UnstyledButton, Stack, Text } from '@mantine/core';
import { IoIosCheckmark, IoIosClose } from 'react-icons/io';
import UserCard from './usercard/usercard';

interface ApprovalRowProps {
  comment: string;
  date: Date;
  reward: number;
  user: {
    name: string;
    address: string;
    avatar: string;
  };
}

const ApprovalRow = (props: ApprovalRowProps) => {
  const date = props.date.toDateString();
  return (
    <tr>
      <td>
        <UserCard w={200} columns={2} {...props.user} />
      </td>
      <td>{props.comment}</td>
      <td>
        <Flex gap="md">
          <UnstyledButton>
            <IoIosCheckmark size={48} color="green" />
          </UnstyledButton>
          <UnstyledButton>
            <IoIosClose size={48} color="red" />
          </UnstyledButton>
        </Flex>
      </td>
      <td>
        <Stack spacing={0}>
          <Text>
            {`${date.split(' ').slice(1, 3).join(' ')},
              ${date.split(' ').at(3)}`}
          </Text>
          <Text color={'#A1A1A1'}>
            {Intl.DateTimeFormat('hk-HK', {
              timeStyle: 'short',
              hourCycle: 'h12',
            })
              .format(new Date())
              .toUpperCase()}
          </Text>
        </Stack>
      </td>
      <td>
        <Text weight={600} color="#0FD293">
          {props.reward}$SD
        </Text>
      </td>
      <td></td>
    </tr>
  );
};

export default ApprovalRow;
