import { Divider, Flex, Input, PasswordInput, Stack } from '@mantine/core';
import { NextPage } from 'next';
import React, { useRef, useState } from 'react';

import Button from '@components/button';
import { Heading1, Heading3, Subheading1 } from '@components/typography';
import { useAuth } from 'src/utils/auth/authContext';
import styles from 'styles/user/settings.module.scss';

const PHONE_PREFIX: Record<string, string> = {
  HK: '+852',
  KR: '+82',
};

const Settings: NextPage = () => {
  const { user } = useAuth();
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState<File>();
  const filePickerRef = useRef<HTMLInputElement>(null);

  return (
    <Stack mr={'10%'}>
      <Flex justify="space-between" align="center">
        <Stack mb="md" spacing={10}>
          <Heading1>Settings</Heading1>
          <Subheading1 color="#A1A1A1">Manage your account</Subheading1>
        </Stack>
        <Button type="secondary" color="black" size="lg" style={{ width: 300 }}>
          Logout
        </Button>
      </Flex>
      <Flex justify="space-between">
        <Stack w="40%">
          <Heading3>Profile Settings</Heading3>
          <Divider mb="md" />
          <Subheading1>Profile Picture</Subheading1>
          <Flex gap="md" align="center" mb="lg">
            <img
              src={
                profilePicture
                  ? URL.createObjectURL(profilePicture)
                  : 'https://cdn.dribbble.com/users/9578072/screenshots/16902417/media/ceea4b54f32875615939394374c2c108.png?compress=1&resize=1600x1200&vertical=top'
              }
              className={styles.image}
            />
            <input
              type="file"
              style={{ display: 'none' }}
              ref={filePickerRef}
              onChange={(event) =>
                setProfilePicture(event.currentTarget.files![0])
              }
            />
            <Button
              size="md"
              className={styles.button}
              onClick={() => filePickerRef.current?.click()}>
              Change
            </Button>
          </Flex>
          <Subheading1>Username</Subheading1>
          <Input disabled value={user?.attributes.name} mt="sm" />
        </Stack>
        <Stack w="40%">
          <Heading3>Account Settings</Heading3>
          <Divider mb="md" />
          <Subheading1>User Data</Subheading1>
          <Stack mt="md" spacing={30}>
            <Stack spacing={15}>
              <Subheading1>Email</Subheading1>
              <Input disabled value={user?.attributes.email} />
            </Stack>
            <Stack spacing={15}>
              <Subheading1>Password</Subheading1>
              <Flex align="center" gap="md">
                <PasswordInput
                  w="100%"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <Button size="md" className={styles.button}>
                  Change
                </Button>
              </Flex>
            </Stack>
            <Stack spacing={15}>
              <Subheading1>Phone No.</Subheading1>
              <Flex gap="md">
                <Input component="select" className={styles.phonePicker}>
                  {Object.keys(PHONE_PREFIX).map((value) => (
                    <option key={value} value={value}>
                      {PHONE_PREFIX[value]}
                    </option>
                  ))}
                </Input>
                <Input w="100%" />
              </Flex>
            </Stack>
          </Stack>
          <Flex justify="space-between" mt="4rem">
            <Button className={styles.button} style={{ width: '48%' }}>
              Reset
            </Button>
            <Button color="black" style={{ width: '48%' }}>
              Save Changes
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default Settings;
