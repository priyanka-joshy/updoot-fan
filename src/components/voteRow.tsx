import { Subheading3 } from '@components/typography';
import { Flex } from '@mantine/core';
import { TbTriangle, TbTriangleInverted } from 'react-icons/tb';

interface IProps {
  src: string;
  title: string;
  amount: number;
  timestamp: number;
}

const VoteRow = (props: IProps) => {
  return (
    <Flex align="center" justify="space-between" p="md">
      <Flex align="center" w="40%" gap="md">
        <img src={props.src} height={60} width={120} />
        <Subheading3>{props.title}</Subheading3>
      </Flex>
      <Flex align="center">
        {props.amount >= 0 ? (
          <TbTriangle color="#0fd293" fill="#0fd293" />
        ) : (
          <TbTriangleInverted color="#ff0055" fill="#ff0055" />
        )}
        <Subheading3 color={props.amount >= 0 ? '#0fd293' : '#ff0055'}>
          {props.amount} STARDUST
        </Subheading3>
      </Flex>
      <Subheading3>{new Date(props.timestamp).toLocaleString()}</Subheading3>
    </Flex>
  );
};

export default VoteRow;
