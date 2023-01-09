import {
  Anchor,
  Avatar,
  Box,
  Checkbox,
  CloseButton,
  Flex,
  Grid,
  Group,
  Input,
  Modal,
  MultiSelect,
  MultiSelectValueProps,
  Stack,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import {
  GetServerSideProps,
  GetStaticProps,
  InferGetServerSidePropsType,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import { useRouter } from 'next/router';

import { forwardRef, useEffect, useState } from 'react';
import api from 'src/utils/api';
import styles from 'styles/user/proposals/create.module.scss';

import { TbChevronLeft, TbChevronUp, TbEdit, TbUpload } from 'react-icons/tb';
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
import { useForm } from '@mantine/form';
import { FileWithPath } from '@mantine/dropzone';
import { uploadFile } from 'src/utils/storage';
import { withSSRContext } from 'aws-amplify';
import getWalletBalance from 'src/utils/getWalletBalance';

const Create: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { user: author } = useAuth();
  const [proposalId, setProposalId] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [publishCompleteModal, setPublishCompleteModal] = useState(false);
  const [proposalData, setProposalData] = useState<CreateProposalFormData>();
  const router = useRouter();

  const getArtistCompany = (artists: string[]) => {
    const artistlist: Artist[] = [];
    artists.forEach((item) => {
      let temp = props.artists.find((artist: Artist) => artist._id === item)!;
      artistlist.push(temp);
    });

    const companyIds = artistlist
      .map((artist) => artist.companyId)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    return companyIds;
  };

  const getArtistBrand = (artists: string[]) => {
    const artistlist: Artist[] = [];
    artists.forEach((item) => {
      let temp = props.artists.find((artist: Artist) => artist._id === item)!;
      artistlist.push(temp);
    });

    const brands = artistlist
      .map((artist) => artist.brand)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    return brands;
  };
  const getSponsorlist = (artists: string[]) => {
    const companyIds = getArtistCompany(artists);

    const result = props.sponsors.filter(
      (sponsor) => sponsor.companyId && companyIds.includes(sponsor.companyId)
    );
    return result;
  };

  interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    value: string;
    name: string;
  }

  const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, value, name, ...others }: ItemProps, ref) => (
      <div ref={ref} {...others}>
        <div className={styles.selectItem}>
          <Group noWrap>
            <Avatar src={image} />
            <div>
              <Text>
                {name} ({label})
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
    name,
    image,
    onRemove,
    classNames,
    ...others
  }: MultiSelectValueProps & {
    value: string;
    image: string;
    name: string;
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
            {name}({label})
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

  const submitProposal = async () => {
    // upload title image to S3 Bucket
    if (!proposalData) {
      return;
    }
    const titleImageUpload = await uploadFile(
      author!.attributes.email,
      `proposals/${new Date().toISOString()}--${proposalData.title}`,
      proposalData.titleImage!
    );
    if (titleImageUpload instanceof Error) {
      throw new Error('upload failed title image');
    }
    // upload supporting material to S3 bucket
    let supportMaterialUpload: string[] = [];
    if (proposalData.supportingMaterials) {
      supportMaterialUpload = await Promise.all(
        proposalData.supportingMaterials!.map(async (material) => {
          const uploadres = await uploadFile(
            author!.attributes.email,
            `proposals/${new Date().toISOString()}--${proposalData.title}`,
            material
          );
          if (uploadres instanceof Error) {
            throw new Error('upload failed title image');
          }
          return uploadres.key;
        })
      );
    }

    const body = {
      ...proposalData,
      supportingMaterials: supportMaterialUpload,
      companyId: getArtistCompany(proposalData.artistId),
      brand: getArtistBrand(proposalData.artistId)[0],
      type: 'proposal',
      titleImage: titleImageUpload.key,
    };
    console.log(body);

    const res = await api.proposal.post('/submit', body);
    setProposalId(res.message.proposalId);
    setPublishCompleteModal(true);
  };
  interface CreateProposalFormData {
    title: string;
    details: string;
    companyId: string;
    artistId: string[];
    supportingMaterials: File[] | null;
    brand: string;
    sponsors: ProposalSponsor[];
    author: string;
    titleImage: FileWithPath | null;
    proposalType: string;
  }

  const form = useForm<CreateProposalFormData>({
    validateInputOnBlur: true,
    initialValues: {
      title: '',
      details: '',
      companyId: '',
      artistId: [],
      supportingMaterials: null,
      brand: '',
      sponsors: [],
      author: author!.attributes.email,
      titleImage: null,
      proposalType: '',
    },

    validate: {
      title: (value) => (value ? null : 'Title is required'),
      details: (value) => (value ? null : 'Description is required'),
      artistId: (value) =>
        value.length > 0 ? null : 'please select at least one artist',
      sponsors: (value) =>
        value.length > 0 ? null : 'please select at least one sponsor',
      titleImage: (value) => (value ? null : 'please upload a title image'),
    },
  });

  return (
    <div>
      <Modal
        centered={true}
        radius={'xl'}
        opened={modalOpened}
        onClose={() => setModalOpened(false)}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await submitProposal();
            setModalOpened(false);
          }}>
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
            <Button style={{ width: '90%', margin: '1rem' }}>
              <TbUpload />
              Publish
            </Button>
          </Stack>
        </form>
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
      <form
        onSubmit={form.onSubmit(async (values) => {
          setProposalData(values);
          setModalOpened(true);
        })}>
        <Grid gutter={'sm'} style={{ padding: '1rem' }}>
          <Grid.Col md={8} style={{ marginRight: '2rem' }}>
            <Heading1>Create proposal</Heading1>
            {/* <pre>{JSON.stringify(form.values, null, 2)}</pre> */}
            <Stack className={styles.inputContainer}>
              <Heading3>Artist</Heading3>
              <MultiSelect
                {...form.getInputProps('artistId')}
                placeholder="Which artist is this proposal for?"
                itemComponent={SelectItem}
                valueComponent={ValueItem}
                data={props.artists.map((artist: Artist, key: number) => ({
                  value: artist._id,
                  name: artist.name,
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
                data={getSponsorlist(form.values.artistId).map(
                  (sponsor, key) => ({
                    value: sponsor._id,
                    name: sponsor.username,
                    label: sponsor.companyId,
                    image: sponsor.profilePicture,
                    id: key,
                  })
                )}
                searchable
                nothingFound="No Sponsors"
                maxDropdownHeight={400}
                filter={(value, selected, item) =>
                  !selected &&
                  item.label!.toLowerCase().includes(value.toLowerCase().trim())
                }
                {...form.getInputProps('sponsors')}
              />
            </Stack>

            <Stack className={styles.inputContainer}>
              <Heading3>Title Image</Heading3>
              <Dropzone
                onDrop={(file) => form.setFieldValue('titleImage', file[0])}
                value={form.values.titleImage}
                title="Upload title image"
                placeholder="(max. 2160 x 1080)"
                mt="sm"
                {...form.getInputProps('titleImage')}></Dropzone>
            </Stack>

            <Stack className={styles.inputContainer}>
              <Input.Label>
                {<Heading3 style={{ display: 'inline' }}>Title</Heading3>}
              </Input.Label>
              <TextInput
                placeholder="What are you proposing? (Maximum 100 characters)"
                {...form.getInputProps('title')}
              />
            </Stack>
            <Stack className={styles.inputContainer}>
              <Heading3>Description</Heading3>
              <Textarea
                minRows={4}
                placeholder="What are the details of your proposal?"
                {...form.getInputProps('details')}></Textarea>
            </Stack>
            <Stack className={styles.inputContainer}>
              <Heading3>Supporting Files</Heading3>
              {!form.values.supportingMaterials ||
              form.values.supportingMaterials.length < 1 ? (
                <>
                  {/* <pre>
                    {JSON.stringify(
                      { ...form.getInputProps('supportingMaterial') },
                      null,
                      2
                    )}
                  </pre> */}
                  <Dropzone
                    multiple
                    maxFiles={5}
                    type={'file'}
                    title="Drag & Drop maximum 5 files "
                    placeholder="(max. 2160 x 1080)"
                    mt="sm"
                    onDrop={(file) => {
                      form.setFieldValue('supportingMaterials', file);
                    }}
                    {...form.getInputProps('supportingMaterials')}></Dropzone>
                </>
              ) : (
                <>
                  {form.values.supportingMaterials.map((file, i) => (
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
                            if (form.values.supportingMaterials!.length === 1) {
                              form.setFieldValue('supportingMaterials', null);
                            }
                            form.removeListItem('supportingMaterials', i);
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
              right: 0,
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
                // disabled={form.values.title ? false : true}
                size="md"
                color="black"
                style={{
                  marginLeft: 'auto',
                  marginRight: '0',
                  width: '100%',
                }}
                onClick={() => {
                  form.setFieldValue('proposalType', 'draft');
                }}>
                <TbEdit />
                Save Draft
              </Button>
              <Button
                type="primary"
                size="md"
                color="purple"
                disabled={!(form.isTouched() && form.isValid())}
                // disabled={form.isValid() ? false : true}
                onClick={async () => {
                  form.setFieldValue('proposalType', 'publish');
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
      </form>
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
      artists,
      balance,
      sponsors: sponsorRes.message.sponsors,
    },
  };
};

export default Create;
