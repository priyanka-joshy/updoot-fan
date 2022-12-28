import {
  Avatar,
  Box,
  Button as ButtonMantine,
  CloseButton,
  Flex,
  Grid,
  Group,
  Input,
  Loader,
  MultiSelect,
  MultiSelectValueProps,
  SelectItemProps,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { forwardRef, useRef, useState } from 'react';
import { IoIosAddCircle, IoIosEye } from 'react-icons/io';
import { WiStars } from 'react-icons/wi';
import { RxCross1, RxMargin } from 'react-icons/rx';

import styles from 'styles/user/proposals/create.module.scss';
import Dropzone from '@components/dropzone';
import Dropdown from '@components/dropdown';
import FilePicker from '@components/filePicker';
import UserCard from '@components/userInfo';

import {
  TbCalendar,
  TbChevronLeft,
  TbChevronUp,
  TbEdit,
  TbSearch,
  TbUpload,
} from 'react-icons/tb';
import { Heading1, Heading3, Subheading1 } from '@components/typography';
import Button from '@components/button';
import StatCard from '@components/statCard';
import { useAuth } from 'src/utils/auth/authContext';

const Create: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { user } = useAuth();
  console.log(user?.attributes);
  const [artist, setArtist] = useState('');
  const [details, setDetails] = useState('');
  const [titleImage, setTitleImage] = useState<File | null>();
  const [SupportingFiles, setSupportingFiles] = useState<File[]>([]);
  const dropdownType = 'artist';

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <div className={styles.selectItem}>
          <Group noWrap>
            <Avatar src={image} />
            <div>
              <Text>{label}</Text>
            </div>
          </Group>
        </div>
      </div>
    )
  );

  function ValueItem({
    value,
    label,
    image,
    onRemove,
    classNames,
    ...others
  }: MultiSelectValueProps & {
    value: string;
    image: string;
  }) {
    return (
      <div {...others}>
        <Box
          sx={(theme) => ({
            display: 'flex',
            cursor: 'default',
            alignItems: 'center',
            paddingLeft: 10,
            borderRadius: 4,
            border: '1px solid black',
            margin: '0.2rem',
          })}>
          <Avatar className={styles.logo} src={image} />

          <Box sx={{ lineHeight: 1, fontSize: 12 }}>{label}</Box>
          <CloseButton
            onMouseDown={onRemove}
            variant="transparent"
            size={22}
            iconSize={14}
            tabIndex={-1}
          />
        </Box>
      </div>
    );
  }

  return (
    <div>
      <UnstyledButton
        style={{
          marginRight: 'auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
        <TbChevronLeft size={20} />
        Back
      </UnstyledButton>
      <Grid gutter={'sm'} style={{ padding: '1rem' }}>
        <Grid.Col md={8} style={{ marginRight: '2rem' }}>
          <Heading1>Create proposal</Heading1>
          <Stack className={styles.inputContainer}>
            <Heading3>Artist</Heading3>
            <MultiSelect
              placeholder="Which artist is this proposal for?"
              itemComponent={SelectItem}
              valueComponent={ValueItem}
              data={props.sponsors}
              searchable
              nothingFound="Nobody here"
              maxDropdownHeight={400}
              filter={(value, selected, item) =>
                !selected &&
                item.label!.toLowerCase().includes(value.toLowerCase().trim())
              }
            />
          </Stack>

          <Stack className={styles.inputContainer}>
            <Heading3>Sponsors</Heading3>
            <MultiSelect
              placeholder="Type the artist name to find a related sponsor"
              itemComponent={SelectItem}
              valueComponent={ValueItem}
              data={props.sponsors}
              searchable
              nothingFound="No Sponsors"
              maxDropdownHeight={400}
              filter={(value, selected, item) =>
                !selected &&
                item.label!.toLowerCase().includes(value.toLowerCase().trim())
              }
            />
          </Stack>
          <Stack className={styles.inputContainer}>
            <Heading3>Title Image</Heading3>
            <Dropzone
              value={titleImage}
              onDrop={(files) => setTitleImage(files[0])}
              title="Upload title image"
              placeholder="(max. 2160 x 1080)"
              mt="sm"></Dropzone>
          </Stack>

          <Stack className={styles.inputContainer}>
            <Heading3>Duration</Heading3>
            <Flex gap="sm">
              <DatePicker
                style={{ width: '100%' }}
                icon={<TbCalendar />}
                placeholder="Starting date & time"></DatePicker>
              <DatePicker
                style={{ width: '100%' }}
                icon={<TbCalendar />}
                placeholder="End date & time"></DatePicker>
            </Flex>
          </Stack>
          <Stack className={styles.inputContainer}>
            <Heading3>Title</Heading3>
            <TextInput placeholder="What are you proposing? (Maximum 100 characters)" />
          </Stack>
          <Stack className={styles.inputContainer}>
            <Heading3>Description</Heading3>
            <Textarea
              minRows={4}
              placeholder="What are the details of your proposal?"></Textarea>
          </Stack>
          <Stack className={styles.inputContainer}>
            <Heading3>Supporting Files</Heading3>
            {SupportingFiles.length === 0 ? (
              <>
                <Dropzone
                  multiple
                  maxFiles={5}
                  value={SupportingFiles && SupportingFiles[0]}
                  onDropAny={(files) => {
                    setSupportingFiles([...files]);
                  }}
                  title="Drag & Drop maximum 5 files "
                  placeholder="(max. 2160 x 1080)"
                  mt="sm"></Dropzone>
              </>
            ) : (
              <>
                {SupportingFiles.map((file, i) => (
                  <Box
                    sx={{ border: '1px solid #A1A1A1' }}
                    style={{ borderRadius: '0.5rem' }}>
                    <Flex
                      className={styles.supportDocuments}
                      justify="space-between">
                      <Text>{file.name}</Text>
                      <CloseButton
                        onMouseDown={() => {
                          setSupportingFiles((prev) => {
                            const temp = [...prev];
                            temp.splice(i, 1);
                            return temp;
                          });
                        }}
                        variant="transparent"
                        size={22}
                        iconSize={14}
                        tabIndex={-1}
                      />
                    </Flex>
                  </Box>
                ))}
              </>
            )}
          </Stack>
          <Button disabled>Upload</Button>
        </Grid.Col>
        <Grid.Col
          md={3}
          style={{
            position: 'fixed',
            right: '2rem',
            top: '12rem',
            width: '100%',
          }}>
          <Stack spacing={'lg'}>
            <StatCard
              style={{ whiteSpace: 'pre-wrap', alignContent: 'left' }}
              isOnProposalCreate
              description={`The more detailed your proposal is, the fewer STARDUST will be needed.\n\nPro Tip: Pick a sponsor to participate in the campaign to improve your credibility.This will help you level up faster! `}
              data={''}
            />
            <Subheading1 color="purple">
              Draft saved {'30 December, 2022 2PM'}
            </Subheading1>
            <Button
              type="secondary"
              size="md"
              color="black"
              style={{
                marginLeft: 'auto',
                marginRight: '0',
                width: '100%',
              }}>
              <TbEdit />
              Save Draft
            </Button>
            <Button
              type="primary"
              size="md"
              color="purple"
              style={{
                marginLeft: 'auto',
                marginRight: '0',
                width: '100%',
              }}>
              <TbUpload />
              Publish
            </Button>
          </Stack>
        </Grid.Col>
      </Grid>
      <UnstyledButton
        style={{
          margin: 'auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
        <TbChevronUp size={25} />
        Back
      </UnstyledButton>
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  sponsors: any[];
  artists: any[];
  stardust: number;
}> = async () => ({
  props: {
    sponsors: [
      {
        value: 'DJ Soda (Spinnin Asia)',
        label: 'DJ Soda (Spinnin Asia)',
        image: '/comment-avatar-1.png',
      },
      {
        value: 'Hannah Lane (Starship Entertainment)',
        label: 'Hannah Lane (Starship Entertainment)',
        image: '/comment-avatar-1.png',
      },
      {
        value: 'Satish Patel (Warner Music Asia)',
        label: 'Satish Patel (Warner Music Asia)',
        image: '/comment-avatar-1.png',
      },
      {
        value: 'Josh Richardson (Highline Entertainment)',
        label: 'Josh Richardson (Highline Entertainment)',
        image: '/comment-avatar-1.png',
      },
    ],
    artists: [
      {
        value: 'DJ Soda (Spinnin Asia)',
        label: 'DJ Soda (Spinnin Asia)',
        image: '/comment-avatar-1.png',
      },
      {
        value: 'Hannah Lane (Starship Entertainment)',
        label: 'Hannah Lane (Starship Entertainment)',
        image: '/comment-avatar-1.png',
      },
      {
        value: 'Satish Patel (Warner Music Asia)',
        label: 'Satish Patel (Warner Music Asia)',
        image: '/comment-avatar-1.png',
      },
      {
        value: 'Josh Richardson (Highline Entertainment)',
        label: 'Josh Richardson (Highline Entertainment)',
        image: '/comment-avatar-1.png',
      },
    ],
    stardust: 300,
  },
});

export default Create;
