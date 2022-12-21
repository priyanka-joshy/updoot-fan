import {
  Header as HeaderMantine,
  HeaderProps,
  UnstyledButton,
  Flex,
  Divider,
} from '@mantine/core';
import { BiSearch, BiBell, BiWallet } from 'react-icons/bi';
import { TbPlus } from 'react-icons/tb';
import { HiOutlineCog } from 'react-icons/hi';
import Button from '@components/button';
import { useRouter } from 'next/router';

import styles from './styles.module.scss';
import UpdootSVG from 'public/updoot.svg';
import LogoSVG from 'public/logo.svg';

const Header = (props: Partial<HeaderProps>) => {
  const router = useRouter();

  return (
    <HeaderMantine height={70} className={styles.container} {...props}>
      <Flex align={'center'} gap={'sm'}>
        <LogoSVG className={styles.updoot} />
        <UpdootSVG className={styles.updoot} />
      </Flex>

      <div className={styles.utilContainer}>
        <UnstyledButton>
          <BiWallet size={'1.5rem'} />
        </UnstyledButton>
        <UnstyledButton>
          <BiSearch size={'1.5rem'} />
        </UnstyledButton>
        <UnstyledButton>
          <BiBell size={'1.5rem'} />
        </UnstyledButton>
        <UnstyledButton>
          <HiOutlineCog size={'1.5rem'} />
        </UnstyledButton>
        <Button color="black" onClick={() => router.push('proposals/create')}>
          <TbPlus style={{ verticalAlign: 'middle' }} />
        </Button>
        <Divider
          orientation="vertical"
          color="black"
          style={{ margin: '0.4rem 0' }}
        />
        <img
          style={{
            width: '40px',
            borderRadius: '50%',
            border: '1px solid #CCCCCC',
          }}
          src="/comment-avatar-1.png"
        />
      </div>
    </HeaderMantine>
  );
};

export default Header;
