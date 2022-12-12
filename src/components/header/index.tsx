import {
  Header as HeaderMantine,
  HeaderProps,
  UnstyledButton,
} from '@mantine/core';
import { BiSearch, BiBell, BiWallet } from 'react-icons/bi';
import { HiOutlineCog } from 'react-icons/hi';

import styles from './styles.module.scss';
import UpdootSVG from 'public/updoot.svg';

const Header = (props: Partial<HeaderProps>) => {
  return (
    <HeaderMantine height={70} className={styles.container} {...props}>
      <UpdootSVG className={styles.updoot} />
      <div className={styles.utilContainer}>
        <UnstyledButton>
          <BiSearch size={'1.5rem'} color="#ffffff" />
        </UnstyledButton>
        <UnstyledButton>
          <BiWallet size={'1.5rem'} color="#ffffff" />
        </UnstyledButton>
        <UnstyledButton>
          <BiBell size={'1.5rem'} color="#ffffff" />
        </UnstyledButton>
        <UnstyledButton>
          <HiOutlineCog size={'1.5rem'} color="#ffffff" />
        </UnstyledButton>
      </div>
    </HeaderMantine>
  );
};

export default Header;
