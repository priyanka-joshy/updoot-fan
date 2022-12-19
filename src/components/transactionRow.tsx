import { Flex, UnstyledButton } from '@mantine/core';
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io';
import { TbDotsVertical } from 'react-icons/tb';
import { Subheading3 } from './typography';

interface IProps {
  action: string;
  date: EpochTimeStamp;
  amount: number;
}

const TransactionRow = (props: IProps) => {
  const date = new Date(props.date).toDateString();
  return (
    <tr>
      <td>
        <Flex align="center">
          {props.amount > 0 ? (
            <IoMdArrowDropup color="#0FD293" size={36} />
          ) : (
            <IoMdArrowDropdown color="#FF0055" size={36} />
          )}
          <Subheading3 color={props.amount > 0 ? '#0FD293' : '#FF0055'}>
            {props.amount} STARDUST
          </Subheading3>
        </Flex>
      </td>
      <td>
        <Subheading3>{props.action}</Subheading3>
      </td>
      <td>
        <Subheading3>
          {date.split(' ').slice(1, 3).join(' ') + ', ' + date.split(' ').at(3)}{' '}
          /{' '}
          {Intl.DateTimeFormat('hk-HK', {
            timeStyle: 'short',
            hourCycle: 'h12',
          })
            .format(new Date())
            .toUpperCase()}{' '}
          ({Intl.DateTimeFormat().resolvedOptions().timeZone})
        </Subheading3>
      </td>
      <td>
        <UnstyledButton>
          <TbDotsVertical />
        </UnstyledButton>
      </td>
    </tr>
  );
};

export default TransactionRow;
