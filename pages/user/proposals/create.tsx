import {
  Anchor,
  Avatar,
  Box,
  Checkbox,
  CloseButton,
  Flex,
  Grid,
  Group,
  Modal,
  MultiSelect,
  MultiSelectValueProps,
  Stack,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';

import { forwardRef, useEffect, useState } from 'react';
import api from 'src/utils/api';
import styles from 'styles/user/proposals/create.module.scss';

import {
  TbCalendar,
  TbChevronLeft,
  TbChevronUp,
  TbEdit,
  TbUpload,
} from 'react-icons/tb';
import {
  BodyText,
  Heading1,
  Heading3,
  Subheading1,
} from '@components/typography';
import Button from '@components/button';
import StatCard from '@components/statCard';
import { useAuth } from 'src/utils/auth/authContext';
import Dropzone from '@components/dropzone';
import { Artist, Proposal, ProposalSponsor } from 'src/utils/types';
import { withSSRContext } from 'aws-amplify';
import getWalletBalance from 'src/utils/getWalletBalance';

const Create: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { user: author } = useAuth();
  const [artist, setArtist] = useState<Artist[]>([]);
  const [sponsors, setSponsors] = useState<ProposalSponsor[]>([]);
  const [availableSponsors, setAvailableSponsors] = useState<ProposalSponsor[]>(
    []
  );
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [titleImage, setTitleImage] = useState<File | null>();
  // titleImage => uploaded on aws bucket, link sent to heroku db
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  // SupportFiles => uploaded on aws bucket, link sent to heroku db
  const [proposalId, setProposalId] = useState<string>('0');
  const [modalOpened, setModalOpened] = useState(false);
  const [publishCompleteModal, setPublishCompleteModal] = useState(false);
  const router = useRouter();

  useEffect(
    () =>
      setAvailableSponsors(
        props.sponsors.filter((sponsor) =>
          artist
            .map((artist) => artist.companyId)
            .includes(sponsor.companyId ?? '')
        )
      ),
    [artist]
  );

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    value: string;
  }

  const createProposal = () => {
    const body: Partial<Proposal> = {
      title: title,
      details: description,
      supportingMaterials: ['test'],
      artistId: artist.map((a) => a._id),
      companyId: 'companyId',
      brand: 'brand',
      sponsors: sponsors.map((a) => a._id),
      author: author?.attributes.email,
      titleImage: 'test',
      // startTime, endTime
    };
    console.log(body);
    return body;
  };
  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, value, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <div className={styles.selectItem}>
          <Group noWrap>
            <Avatar src={image} />
            <div>
              <Text>
                {value} ({label})
              </Text>
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
          sx={{
            display: 'flex',
            cursor: 'default',
            alignItems: 'center',
            paddingLeft: 10,
            borderRadius: 4,
            border: '1px solid black',
            margin: '0.2rem',
          }}>
          <Avatar className={styles.logo} src={image} />

          <Box sx={{ lineHeight: 1, fontSize: 12 }}>
            {value}({label})
          </Box>
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
      <Modal
        centered={true}
        radius={'xl'}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}>
        <Stack align={'center'}>
          <TbUpload color="#6200FF" size={36} />
          <Heading3 style={{ fontWeight: '600' }}>
            Publish Your Proposal
          </Heading3>
          <Subheading1>Publishing requires StarDust to be valid</Subheading1>
          <Stack
            spacing={'sm'}
            style={{
              borderRadius: '1rem',
              border: '1px solid #DFE0EB',
              padding: '1rem',
              marginTop: '2.5rem',
              width: '90%',
            }}>
            <Flex justify={'space-between'}>
              <BodyText>Stardust Balance</BodyText>
              <BodyText>{props.balance}SD</BodyText>
            </Flex>
            <Flex justify={'space-between'}>
              <BodyText>Payment amount</BodyText>
              <BodyText style={{ fontWeight: '700' }}>{-1000}SD</BodyText>
            </Flex>
            <Flex
              justify={'space-between'}
              style={{
                borderTop: '1px solid #DFE0EB',
                paddingTop: '1rem',
              }}>
              <BodyText>Balance after payment</BodyText>
              <BodyText>{props.balance - 1000}SD</BodyText>
            </Flex>
          </Stack>
          <Stack style={{ width: '80%', padding: '1rem 0' }}>
            <Subheading1>Confirm Payment</Subheading1>
            <Checkbox
              required
              color="violet"
              radius={'xl'}
              label={
                <>
                  By clicking “Vote now”, you confirm that you have read,
                  understand, and accepted our
                  <Anchor
                    size="sm"
                    href="https://mantine.dev"
                    target="_blank"
                    color="black"
                    underline={true}>
                    Terms of Use
                  </Anchor>
                  .
                </>
              }
            />
          </Stack>
          <Button
            style={{ width: '90%', margin: '1rem' }}
            onClick={async () => {
              const body = createProposal();
              const res = await api.proposal.post('/create', body);
              setProposalId(res.message._id);
              setModalOpened(false);
              setPublishCompleteModal(true);
            }}>
            <TbUpload />
            Publish
          </Button>
        </Stack>
      </Modal>
      <Modal
        centered={true}
        radius={'xl'}
        opened={publishCompleteModal}
        onClose={() => setPublishCompleteModal(false)}>
        <Stack align={'center'}>
          <TbUpload color="#6200FF" size={36} />
          <Heading3 style={{ fontWeight: '600' }}>
            Your Proposal is Published
          </Heading3>

          <Button
            style={{ width: '90%', margin: '1rem' }}
            onClick={() => {
              router.replace(`/user/proposals/${proposalId}`);
            }}>
            <TbUpload />
            View Proposal
          </Button>
        </Stack>
      </Modal>
      <UnstyledButton
        style={{
          marginRight: 'auto',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}
        onClick={() => router.back()}>
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
              onChange={(selectedItems) => {
                const artistlist: Artist[] = [];
                selectedItems.forEach((item) => {
                  let temp = props.artists.find(
                    (artist) => artist.name === item
                  )!;

                  artistlist.push(temp);
                });
                setArtist(artistlist);
                //filter sponsorlist for valid sponsors from same artist company
              }}
              data={props.artists.map((artist: Artist, key) => ({
                value: artist.name,
                label: artist.companyId,
                image: artist.image,
                id: key,
              }))}
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
              data={availableSponsors.map((sponsor, key) => ({
                value: sponsor.username,
                label: sponsor.companyId,
                image: sponsor.profilePicture,
                id: key,
              }))}
              onChange={(selectedItems) => {
                const sponsorlist: ProposalSponsor[] = [];
                selectedItems.forEach((item) => {
                  let temp = availableSponsors.find(
                    (sponsor) => sponsor.username === item
                  )!;
                  sponsorlist.push(temp);
                });
                setSponsors(sponsorlist);
              }}
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
                value={startDate}
                onChange={(date) => date && setStartDate(date)}
                placeholder="Starting date & time"></DatePicker>
              <DatePicker
                style={{ width: '100%' }}
                icon={<TbCalendar />}
                value={endDate}
                minDate={startDate}
                onChange={(date) => date && setEndDate(date)}
                placeholder="End date & time"></DatePicker>
            </Flex>
          </Stack>
          <Stack className={styles.inputContainer}>
            <Heading3>Title</Heading3>
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you proposing? (Maximum 100 characters)"
            />
          </Stack>
          <Stack className={styles.inputContainer}>
            <Heading3>Description</Heading3>
            <Textarea
              minRows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are the details of your proposal?"></Textarea>
          </Stack>
          <Stack className={styles.inputContainer}>
            <Heading3>Supporting Files</Heading3>
            {supportingFiles.length === 0 ? (
              <>
                <Dropzone
                  multiple
                  maxFiles={5}
                  value={supportingFiles && supportingFiles[0]}
                  type={'file'}
                  onDropAny={(files) => {
                    setSupportingFiles([...files]);
                  }}
                  title="Drag & Drop maximum 5 files "
                  placeholder="(max. 2160 x 1080)"
                  mt="sm"></Dropzone>
              </>
            ) : (
              <>
                {supportingFiles.map((file, i) => (
                  <Box
                    key={i}
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
        </Grid.Col>
        <Grid.Col
          md={3}
          style={{
            position: 'fixed',
            right: '2rem',
            top: '12rem',
            width: '100%',
          }}>
          <Stack spacing={'xl'}>
            <StatCard
              style={{ whiteSpace: 'pre-wrap', alignContent: 'left' }}
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
              onClick={async () => {
                const body = createProposal();
                await api.proposal.post('/create', body);
              }}
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
              onClick={async () => {
                const body = createProposal();
                await api.proposal.post('/submit', body);
                setModalOpened(true);
              }}
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
        }}
        onClick={() => window.scrollTo(0, 0)}>
        <TbChevronUp size={25} />
        Back up
      </UnstyledButton>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  artists: Artist[];
  balance: number;
  sponsors: ProposalSponsor[];
}> = async (context) => {
  const SSR = withSSRContext(context);
  const { name } = (await SSR.Auth.currentAuthenticatedUser()).attributes;
  const { message: user } = await api.user.get(`/getUserByUsername/${name}`);
  const balance = await getWalletBalance(user.walletAddress);
  const { message: artists } = await api.artist.get('/all');
  const sponsorRes = await api.proposal.post('/sponsors', {
    companiesId: artists.map((artist: Artist) => artist.companyId) as string[],
  });
  return {
    props: {
      // get sponsors and artists list
      artists,
      balance,
      sponsors: sponsorRes.message.sponsors,
    },
  };
};

export default Create;
