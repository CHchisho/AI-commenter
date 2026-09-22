import {Request, Response, NextFunction} from 'express';
import fs from 'fs';
import path from 'path';
import fetchData from '../../lib/fetchData';
import getOpenAiUrl from '../../lib/openaiUrl';
import CustomError from '../../classes/CustomError';
import {ImageGenerationResponse} from '../../types/OpenAITypes';

const uploadsDir = path.join(process.cwd(), 'uploads');

const saveImageFromResponse = async (
  image: ImageGenerationResponse['data'][0],
  filename: string
): Promise<void> => {
  const filePath = path.join(uploadsDir, filename);

  if (image.b64_json) {
    fs.writeFileSync(filePath, Buffer.from(image.b64_json, 'base64'));
    return;
  }

  if (!image.url) {
    throw new CustomError('Image not generated', 502);
  }

  const imageResponse = await fetch(image.url);
  if (!imageResponse.ok) {
    throw new CustomError('Failed to download generated image', 502);
  }

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  fs.writeFileSync(filePath, imageBuffer);
};

const thumbnailPost = async (
  req: Request<{}, {}, {topic: string; extraDetails?: string}>,
  res: Response<{filename: string; prompt: string; url: string}>,
  next: NextFunction
) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, {recursive: true});
    }

    const topic = req.body.topic.trim();
    const extraDetails = req.body.extraDetails?.trim();

    const prompt =
      `YouTube thumbnail about ${topic}. ` +
      'Colorful image, clear main subject, simple background, short splash text. ' +
      'No logos, watermarks, or copyrighted characters. ' +
      (extraDetails ? extraDetails : '');

    const data = await fetchData<ImageGenerationResponse>(
      getOpenAiUrl('v1/images/generations'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1',
          prompt,
          size: '1024x1024',
        }),
      }
    );

    const generatedImage = data.data[0];
    if (!generatedImage) {
      throw new CustomError('Image not generated', 502);
    }

    const filename = `thumbnail-${Date.now()}.png`;
    await saveImageFromResponse(generatedImage, filename);

    res.json({
      filename,
      prompt,
      url: `/uploads/${filename}`,
    });
  } catch (error) {
    next(error);
  }
};

export {thumbnailPost};
