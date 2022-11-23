import { Flex, Stack, Text, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';

import { BiHeart, BiMessageRounded } from 'react-icons/bi';
import { FiShare, FiBookmark } from 'react-icons/fi';
import styles from './proposalcard.module.scss';

interface ProposalCardProps {
  id: string;
  src: string;
  title: string;
}

const ProposalCard = (props: ProposalCardProps) => {
  const router = useRouter();
  return (
    <Stack
      className={styles.container}
      onClick={() => router.push(`proposals/${props.id}`)}>
      <img src={props.src} />
      <Stack px="lg" pb="xs">
        <Text weight={600}>{props.title}</Text>
        <Flex gap="sm">
          <UnstyledButton
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
            }}>
            <BiHeart size={24} />
          </UnstyledButton>
          <UnstyledButton>
            <BiMessageRounded size={24} />
          </UnstyledButton>
        </Flex>
      </Stack>
      <Flex gap="sm" className={styles.corner}>
        <UnstyledButton>
          <FiBookmark size={20} />
        </UnstyledButton>
        <UnstyledButton>
          <FiShare size={20} />
        </UnstyledButton>
      </Flex>
    </Stack>
  );
};

export default ProposalCard;
