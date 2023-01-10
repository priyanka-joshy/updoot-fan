import { Flex, Stack, UnstyledButton } from '@mantine/core';
import { useRouter } from 'next/router';
import { MouseEvent, SVGAttributes, useState } from 'react';
import { FiBookmark, FiShare } from 'react-icons/fi';
import { TbHeart, TbMessage } from 'react-icons/tb';

import api from 'src/utils/api';
import { useAuth } from 'src/utils/auth/authContext';
import { Campaign, Proposal } from 'src/utils/types';
import styles from './styles.module.scss';
import { Subheading3 } from '@components/typography';

enum ButtonState {
  INACTIVE,
  LOADING,
  ACTIVE,
}

const heartIconProps: SVGAttributes<SVGElement>[] = [
  { fill: 'transparent', stroke: '#000000' },
  { fill: 'transparent', stroke: 'gray' },
  { fill: '#FF0055', stroke: '#FF0055' },
];

const bookmarkIconProps: SVGAttributes<SVGElement>[] = [
  { fill: 'transparent', stroke: '#000000' },
  { fill: 'transparent', stroke: 'gray' },
  { fill: '#6200FF', stroke: '#6200FF' },
];

const PCCard = ({
  isProposal = false,
  ...props
}: (Proposal | Campaign) & {
  liked?: boolean;
  bookmarked?: boolean;
  isProposal?: boolean;
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [bookmarkState, setBookmarkState] = useState<ButtonState>(
    props.bookmarked ? ButtonState.ACTIVE : ButtonState.INACTIVE
  );
  const [likeState, setLikeState] = useState<ButtonState>(
    props.liked ? ButtonState.ACTIVE : ButtonState.INACTIVE
  );
  return (
    <Stack
      className={styles.container}
      onClick={() => {
        isProposal
          ? router.push(`proposals/${props._id}`)
          : router.push({
              pathname: `proposals/create`,
              query: { draftId: props._id },
            });
      }}>
      {props.titleImage ? (
        <img src="/authPageLogo.svg" className={styles.image} />
      ) : (
        <img src={props.titleImage} className={styles.image} />
      )}
      <Stack px="lg" pb="xs">
        <Subheading3>{props.title}</Subheading3>
        <Flex gap="sm" className={styles.bottom}>
          <UnstyledButton
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
              if (likeState === ButtonState.LOADING) return;
              if (likeState === ButtonState.ACTIVE) {
                setLikeState(ButtonState.LOADING);
                setTimeout(() => setLikeState(ButtonState.INACTIVE), 1000);
              } else {
                setLikeState(ButtonState.LOADING);
                setTimeout(() => setLikeState(ButtonState.ACTIVE), 1000);
              }
            }}>
            <TbHeart size={24} color="red" {...heartIconProps[likeState]} />
          </UnstyledButton>
          <UnstyledButton
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.stopPropagation();
            }}>
            <TbMessage size={24} />
          </UnstyledButton>
        </Flex>
      </Stack>
      <Flex gap="sm" className={styles.corner}>
        <UnstyledButton
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (bookmarkState === ButtonState.LOADING) return;
            if (bookmarkState === ButtonState.INACTIVE) {
              api.user.post('/bookmark/add', {
                email: user!.attributes.email,
                proposalBookmarks: [props._id],
              });
              setBookmarkState(ButtonState.LOADING);
              setTimeout(() => setBookmarkState(ButtonState.ACTIVE), 1000);
            } else {
              api.user.post('/bookmark/delete', {
                email: user!.attributes.email,
                proposalBookmarks: [props._id],
              });
              setBookmarkState(ButtonState.LOADING);
              setTimeout(() => setBookmarkState(ButtonState.INACTIVE), 1000);
            }
          }}>
          <FiBookmark size={20} {...bookmarkIconProps[bookmarkState]} />
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

export default PCCard;
