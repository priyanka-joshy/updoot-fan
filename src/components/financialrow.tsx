import { Flex, Text } from '@mantine/core';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import UserCard from './userInfo';

interface IProps {
  action: string;
  date: EpochTimeStamp;
  amount: number;
  user: {
    name: string;
    address: string;
    avatar: string;
    level: number;
  };
}

const FinancialRow = (props: IProps) => {
  const date = new Date(props.date).toDateString();
  let backgroundColor = '#0FD293';
  if (props.user.level < 10) backgroundColor = '#FF0055';
  else if (props.user.level < 20) backgroundColor = '#6200FF';
  return (
    <tr>
      <td>
        <UserCard w={200} columns={2} {...props.user} />
      </td>
      <td>
        <Flex align="center">
          {props.amount > 0 ? (
            <IoMdArrowDropup color="#0FD293" size={36} />
          ) : (
            <IoMdArrowDropdown color="#FF0055" size={36} />
          )}
          <Text weight={600} color={props.amount > 0 ? '#0FD293' : '#FF0055'}>
            {props.amount} STARDUST
          </Text>
        </Flex>
      </td>
      <td>{props.action}</td>
      <td>
        <div>
          <Text>
            {date.split(' ').slice(1, 3).join(' ') +
              ', ' +
              date.split(' ').at(3)}
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
        <Text
          c="#ffffff"
          weight={600}
          w="fit-content"
          px="lg"
          style={{ borderRadius: 20, backgroundColor }}>
          {props.user.level}
        </Text>
      </td>
    </tr>
  );
};

export default FinancialRow;
