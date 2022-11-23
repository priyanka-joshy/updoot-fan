import {
  Button,
  Flex,
  Grid,
  Group,
  Input,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { NextPage } from 'next';
import { useState } from 'react';
import { IoIosAddCircle, IoIosEye } from 'react-icons/io';

import Dropzone from '../../src/components/dropzone';
import FilePicker from '../../src/components/filepicker';
import Sponsor from '../../src/components/sponsor';

const SPONSORS = [
  {
    name: 'Jane Smith',
    level: 21,
    avatar:
      'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Taz-Looney_Tunes.svg/1200px-Taz-Looney_Tunes.svg.png',
  },
  {
    name: 'Paul Leto',
    level: 23,
    avatar:
      'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Taz-Looney_Tunes.svg/1200px-Taz-Looney_Tunes.svg.png',
  },
  {
    name: 'Ann Lee',
    level: 30,
    avatar:
      'https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Taz-Looney_Tunes.svg/1200px-Taz-Looney_Tunes.svg.png',
  },
];

const STARDUST_AMOUNT = 300;

const Create: NextPage = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [titleImage, setTitleImage] = useState<File | null>();
  const [supportingMedia, setSupportingMedia] = useState<File | null>();
  return (
    <div>
      <Text weight={600} size={30}>
        Create Proposal
      </Text>
      <Grid>
        <Grid.Col md={6}>
          <TextInput
            mt="lg"
            label="Main Title"
            withAsterisk
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Choose an engaging title to grab the community's attention (max. 300 characters)"
          />
          <TextInput
            mt="lg"
            label="Details"
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="You can elaborate on your thoughts and ideas here."
          />
          <Input.Wrapper>
            <Input.Label mt="lg">Supporting Material</Input.Label>
            <FilePicker
              value={supportingMedia}
              onChange={setSupportingMedia}
              placeholder="Images / Audio files / PDF"
            />
          </Input.Wrapper>
          <Dropzone
            value={titleImage}
            onDrop={(files) => setTitleImage(files[0])}
            title="Upload title image"
            placeholder="(max. 2160 x 1080)"
            mt="sm"
          />
        </Grid.Col>
        <Grid.Col md={6}>
          <Text mt={'sm'} weight={600}>
            Sponsor
          </Text>
          <Text color="dimmed">
            Request at least one person to sponsor your proposal
          </Text>
          <Flex
            gap="md"
            my="xl"
            style={{ overflowX: 'scroll', overflowY: 'hidden' }}>
            {SPONSORS.map((sponsor, index) => (
              <Sponsor key={index} {...sponsor} outline />
            ))}
            <UnstyledButton
              style={{
                flex: 1,
                padding: '0.375rem',
                background: 'none',
                border: '1px dashed #CCCCCC',
                borderRadius: '1rem',
              }}>
              <IoIosAddCircle size={35} color="#A1A1A1" />
            </UnstyledButton>
          </Flex>
          <Text weight={600}>Stardust Payment</Text>
          <Text color="dimmed">Uploading a campaign requires Stardust</Text>
          <Text mt="sm" weight={500}>
            {STARDUST_AMOUNT} Stardust required
          </Text>

          <Stack
            my="xl"
            style={{
              border: '1px solid #CCCCCC',
              borderRadius: 10,
              padding: '1rem',
            }}>
            <Text>
              The more detailed your proposal is, the fewer STARDUST will be
              needed.
            </Text>
            <Text>
              Pro Tip: Pick a sponsor to participate in the campaign to improve
              your credibility. This will help you level up faster!
            </Text>
          </Stack>
          <Group spacing="sm">
            <Button color="gray" leftIcon={<IoIosEye />}>
              Preview
            </Button>
            <Button>Submit</Button>
          </Group>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Create;
