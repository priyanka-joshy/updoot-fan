import { Storage } from "aws-amplify";

// upload file to s3 bucket
const uploadFile = async (
  userEmail: string,
  folderPrefix: string, 
  file: File,
) => {
  const filepath = `${userEmail}/${folderPrefix}/${(new Date()).toISOString()}--${file.name}`;

  try {
    const result = await Storage.put(filepath, file, {
      contentType: file.type,
    });
    return result;
  } catch (error) {
    return error as Error;
  }
};

export default uploadFile;
