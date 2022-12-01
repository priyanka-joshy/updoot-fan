import { Flex, UnstyledButton, Stack, Text } from '@mantine/core';
import { IoIosCheckmark, IoIosClose } from 'react-icons/io';
import UserCard from './userInfo';

interface IProps {
  comment: string;
  date: EpochTimeStamp;
  reward: number;
  user: {
    name: string;
    address: string;
    avatar: string;
  };
}

const ApprovalRow = (props: IProps) => {
  const date = new Date(props.date).toDateString();
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
        <div>
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
        </div>
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
