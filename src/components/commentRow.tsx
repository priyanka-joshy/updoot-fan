import { BodyText } from '@components/typography';
import { Flex } from '@mantine/core';

interface IProps {
  content: string;
  timestamp: string;
  status: 'Approval' | 'Pending' | 'Rejected';
}

const CommentRow = (props: IProps) => {
  return (
    <Flex align="center" justify="space-between" p="md">
      <Flex align="center" w="40%" gap="md">
        <BodyText>{props.content}</BodyText>
      </Flex>
      <BodyText>{new Date(props.timestamp).toLocaleString()}</BodyText>
      <BodyText>
        {props.status === 'Approval' ? 'Approved' : props.status}
      </BodyText>
    </Flex>
  );
};

export default CommentRow;
