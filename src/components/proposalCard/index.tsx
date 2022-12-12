import { Subheading3 } from '@components/typography';
import { Flex, Stack, Text, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import { MouseEvent } from 'react';

import { BiHeart, BiMessageRounded } from 'react-icons/bi';
import { FiShare, FiBookmark } from 'react-icons/fi';
import styles from './styles.module.scss';

interface IProps {
  id: string;
  src: string;
  title: string;
}

const ProposalCard = (props: IProps) => {
  const router = useRouter();
  return (
    <Stack
      className={styles.container}
      onClick={() => router.push(`proposals/${props.id}`)}>
      <img src={props.src} className={styles.image} />
      <Stack px="lg" pb="xs">
        <Subheading3>{props.title}</Subheading3>
        <Flex gap="sm" className={styles.bottom}>
          <UnstyledButton
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
            }}>
            <BiHeart size={24} />
          </UnstyledButton>
          <UnstyledButton
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
            }}>
            <BiMessageRounded size={24} />
          </UnstyledButton>
        </Flex>
      </Stack>
      <Flex gap="sm" className={styles.corner}>
        <UnstyledButton
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
          }}>
          <FiBookmark size={20} />
        </UnstyledButton>
        <UnstyledButton
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
          }}>
          <FiShare size={20} />
        </UnstyledButton>
      </Flex>
    </Stack>
  );
};

export default ProposalCard;
