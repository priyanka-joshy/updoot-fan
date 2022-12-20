import { Container, Navbar, NavbarProps, NavLink } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FiCompass } from 'react-icons/fi';
import {
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { AiOutlinePieChart, AiOutlineEye } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbCalendarTime } from 'react-icons/tb';
import { RiChatCheckLine } from 'react-icons/ri';
import { CiBank } from 'react-icons/ci';
import {
  getDashboardType,
  handleUserType,
} from 'src/utils/auth/handleUserAccess';
import { useAuth } from '../../utils/auth/authContext';

import styles from './styles.module.scss';

type UserRole = 'fan' | 'staff';
interface ISidebarLink {
  link: string;
  icon: JSX.Element;
}

const SideBar = (props: Partial<NavbarProps>) => {
  const { user, cognitoLogout } = useAuth();
  if (!user) return null;

  const currentUserGroup = handleUserType(user).group;
  const [mode, setMode] = useState<UserRole>(currentUserGroup);
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
          label={label}
        />
      </Link>
    );
  };

  const handleSwitchView = () => {
    const userView = mode === 'staff' ? 'fan' : 'staff';
    setMode(userView);
    router.push(getDashboardType(userView));
  };

  return (
    <Navbar
      hidden
      hiddenBreakpoint={'sm'}
      width={{ base: 200 }}
      className={styles.container}
      pt="md"
      {...props}>
      <Navbar.Section grow w="100%">
        <Container
          px={0}
          mb={currentUserGroup === 'fan' && mode === 'fan' ? 200 : 'md'}>
          {Object.entries(sidebarData[mode]).map(([label, { link, icon }]) => {
            return <SidebarLink {...{ label, link, icon }} key={label} />;
          })}
        </Container>

        {currentUserGroup === 'staff' && (
          <Container px={0} my={100}>
            <SidebarLink
              label="Settings"
              link="/user/settings"
              icon={<IoSettingsOutline size={24} />}
            />
            <NavLink
              className={styles.navButton}
              label="Switch View"
              icon={<AiOutlineEye size={24} />}
              onClick={() => handleSwitchView()}
            />
          </Container>
        )}

        <NavLink
          className={styles.navButton}
          label="Sign Out"
          icon={<HiOutlineLogout size={24} />}
          onClick={() => cognitoLogout()}
        />
      </Navbar.Section>
    </Navbar>
  );
};

export default SideBar;
