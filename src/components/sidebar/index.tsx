import { Container, Navbar, NavbarProps, NavLink, Stack } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiCompass } from 'react-icons/fi';
import {
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { AiOutlinePieChart } from 'react-icons/ai';
import { TbCalendarTime } from 'react-icons/tb';
import { RiChatCheckLine } from 'react-icons/ri';
import { CiBank } from 'react-icons/ci';
import { handleUserType } from 'src/utils/auth/handleUserAccess';
import { useAuth } from '../../utils/auth/authContext';

import styles from './styles.module.scss';
import { Subheading1 } from '@components/typography';

type UserRole = 'fan' | 'staff';
interface ISidebarLink {
  link: string;
  icon: JSX.Element;
}

const SideBar = (props: Partial<NavbarProps>) => {
  const { user, cognitoLogout } = useAuth();
  if (!user) return null;

  const currentUserGroup = handleUserType(user).group;
  const router = useRouter();
  const currentPath = router.pathname;

  const sidebarData: Record<UserRole, Record<string, ISidebarLink>> = {
    fan: {
      Discover: { link: '/user/proposals', icon: <FiCompass size={24} /> },
      Profile: { link: '/user/profile', icon: <HiOutlineUser size={24} /> },
    },
    staff: {
      Overview: { link: '/admin', icon: <AiOutlinePieChart size={24} /> },
      Campaigns: { link: '', icon: <TbCalendarTime size={24} /> },
      Approval: {
        link: '/admin/approval',
        icon: <RiChatCheckLine size={24} />,
      },
      Financial: { link: '/admin/financial', icon: <CiBank size={24} /> },
      Community: { link: '', icon: <HiOutlineUserGroup size={24} /> },
    },
  };

  const SidebarLink = ({
    label,
    link,
    icon,
  }: ISidebarLink & { label: string }) => {
    return (
      <Link href={link}>
        <NavLink
          className={`${styles.navButton} ${
            currentPath === link ? styles.selected : ''
          }`}
          icon={icon}
          label={
            <Subheading1 color={currentPath === link ? '#6200ff' : '#333333'}>
              {label}
            </Subheading1>
          }
        />
      </Link>
    );
  };

  return (
    <Navbar
      hidden
      hiddenBreakpoint={'sm'}
      width={{ base: 200 }}
      className={styles.container}
      py="md"
      {...props}>
      <Navbar.Section grow w="100%">
        <Stack justify="space-between" h={'100%'}>
          <Container px={0} mx={0}>
            {Object.entries(sidebarData[currentUserGroup]).map(
              ([label, { link, icon }]) => {
                return <SidebarLink {...{ label, link, icon }} key={label} />;
              }
            )}
          </Container>

          <Container px={0} mx={0}>
            <NavLink
              className={styles.navButton}
              label={<Subheading1>Sign Out</Subheading1>}
              icon={<HiOutlineLogout size={24} />}
              onClick={() => cognitoLogout()}
            />
            <NavLink
              className={styles.navButton}
              label={<Subheading1>Help & Support</Subheading1>}
            />
            <NavLink
              className={styles.navButton}
              label={<Subheading1>Legal</Subheading1>}
            />
          </Container>
        </Stack>
      </Navbar.Section>
    </Navbar>
  );
};

export default SideBar;
