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
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
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
import { Artist, Proposal } from 'src/utils/types';
import { useForm } from '@mantine/form';
import { FileWithPath } from '@mantine/dropzone';
import { uploadFile } from 'src/utils/storage';

const Create: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props
) => {
  const { user: author } = useAuth();
  const [proposalId, setProposalId] = useState('');
  const [modalOpened, setModalOpened] = useState(false);
  const [publishCompleteModal, setPublishCompleteModal] = useState(false);
  const router = useRouter();

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

  interface CreateProposalFormData {
    title: string;
    details: string;
    companyId: string;
    artistId: Artist[];
    supportingMaterial: File[] | null;
    brand: string;
    sponsors: Artist[];
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
      supportingMaterial: null,
      brand: '',
      sponsors: [],
      author: author!.attributes.email,
      titleImage: new File([''], 'filename'),
      proposalType: '',
    },

    validate: {
      title: (value) => (value ? null : 'Title is required'),
      details: (value) => (value ? null : 'Description is required'),
      artistId: (value) =>
        value.length > 0 ? null : 'please select at least one artist',
      sponsors: (value) =>
        value.length > 0 ? null : 'please select at least one sponsor',
      titleImage: (value) => (value ? 'please upload a title image' : null),
    },
  });

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
              <BodyText>{props.stardust}SD</BodyText>
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
              <BodyText>{props.stardust - 1000}SD</BodyText>
            </Flex>
          </Stack>
          <Stack style={{ width: '80%', padding: '1rem 0' }}>
            <form>
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
            </form>
          </Stack>
          <Button
            style={{ width: '90%', margin: '1rem' }}
            onClick={async () => {
              form.setFieldValue('proposalType', 'publish');
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
      <form
        onSubmit={form.onSubmit(async (values) => {
          const titleImageUpload = null;
          if (!values.titleImage) {
            const titleImageUpload = await uploadFile(
              author!.attributes.email,
              `proposals/${new Date().toISOString()}--${values.title}`,
              values.titleImage!
            );
            if (titleImageUpload instanceof Error) {
              throw new Error('upload failed title image');
            }
          }

          const supportMaterialUpload: string[] = [];
          values.supportingMaterial!.forEach(async (material) => {
            const uploadres = await uploadFile(
              author!.attributes.email,
              `proposals/${new Date().toISOString()}--${values.title}`,
              material
            );
            if (uploadres instanceof Error) {
              throw new Error('upload failed title image');
            }
            supportMaterialUpload.push(uploadres.key);
          });

          const body = {
            ...values,
            supportingMaterials: supportMaterialUpload,
            companyId: '',
            brand: '',
            type: 'proposal',
            titleImage: titleImageUpload.key,
          };

          console.log(body);
          const res = await api.proposal.post('/create', body);
          setProposalId(res);
        })}>
        <Grid gutter={'sm'} style={{ padding: '1rem' }}>
          <Grid.Col md={8} style={{ marginRight: '2rem' }}>
            <Heading1>Create proposal</Heading1>
            <pre>{JSON.stringify(form.values, null, 2)}</pre>
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
                  form.setFieldValue('artistId', artistlist);

                  //filter sponsorlist for valid sponsors from same artist company
                }}
                data={props.artists.map((artist: Artist, key) => ({
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
                {...form.getInputProps('artistId')}
              />
            </Stack>
            <Stack className={styles.inputContainer}>
              <Heading3>Sponsors</Heading3>
              <MultiSelect
                placeholder="Type the artist name to find a related sponsor"
                itemComponent={SelectItem}
                valueComponent={ValueItem}
                data={props.sponsors.map((sponsor: Artist, key) => ({
                  value: sponsor.name,
                  label: sponsor.companyId,
                  image: sponsor.image,
                  name: sponsor.name,
                  id: key,
                }))}
                onChange={(selectedItems) => {
                  const sponsorlist: Artist[] = [];
                  selectedItems.forEach((item) => {
                    let temp = props.sponsors.find(
                      (sponsor) => sponsor.name === item
                    )!;
                    sponsorlist.push(temp);
                  });
                  form.setFieldValue('sponsors', sponsorlist);
                }}
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
              {!form.values.supportingMaterial ? (
                <>
                  <pre>
                    {JSON.stringify(
                      { ...form.getInputProps('supportingMaterial') },
                      null,
                      2
                    )}
                  </pre>
                  <Dropzone
                    multiple
                    maxFiles={5}
                    type={'file'}
                    title="Drag & Drop maximum 5 files "
                    placeholder="(max. 2160 x 1080)"
                    mt="sm"
                    onDrop={(file) => {
                      form.setFieldValue('supportingMaterial', file);
                    }}
                    {...form.getInputProps('supportingMaterial')}></Dropzone>
                </>
              ) : (
                <>
                  {form.values.supportingMaterial.map((file, i) => (
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
                            form.removeListItem('supportingMaterial', i);
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
            <Button>Submit</Button>
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
                // disabled={form.isValid() ? false : true}
                onClick={async () => {
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

export const getStaticProps: GetStaticProps<{
  sponsors: Artist[];
  artists: Artist[];
  stardust: number;
}> = async () => ({
  props: {
    // get sponsors and artists list
    sponsors: [
      {
        _id: '1',
        brand: "Spinnin' Asia",
        companyId: "Spinnin' Asia",
        name: 'Emma Smith',
        image: '/Comment-avatar-1.png',
      },
      {
        _id: '2',
        brand: 'warner Music',
        companyId: 'Warner Bros Music',
        name: 'Satish Patel',
        image: '/Comment-avatar-1.png',
      },
      {
        _id: '3',
        brand: 'Starship Entertainment',
        companyId: 'Starship Entertainment',
        name: 'Hannah Lane',
        image: '/Comment-avatar-1.png',
      },
    ],
    artists: [
      {
        _id: '1',
        brand: 'warner Music',
        companyId: 'Warner Bros Music',
        name: 'DJ Soda',
        image: '/Comment-avatar-1.png',
      },
      {
        _id: '2',
        brand: 'warner Music',
        companyId: 'Warner Bros Music',
        name: 'Empira',
        image: '/Comment-avatar-1.png',
      },
      {
        _id: '3',
        brand: 'warner Music',
        companyId: 'Warner Bros Music',
        name: 'Gotez',
        image: '/Comment-avatar-1.png',
      },
    ],
    stardust: 300,
  },
});

export default Create;
