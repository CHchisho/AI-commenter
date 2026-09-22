import { Request, Response, NextFunction } from 'express';
import fetchData from '../../lib/fetchData';
import getOpenAiUrl from '../../lib/openaiUrl';
import CustomError from '../../classes/CustomError';
import {
  ChatCompletionResponse,
  ChatMessage,
} from '../../types/OpenAITypes';

const allowedTones = [
  'friendly',
  'funny',
  'formal',
  'sarcastic',
  'professional',
];

const commentPost = async (
  req: Request<{}, {}, { text: string; tone?: string }>,
  res: Response<{ response: string }>,
  next: NextFunction
) => {
  try {
    const commentText = req.body.text.trim();
    const requestedTone = (req.body.tone || 'friendly').toLowerCase();
    const tone = allowedTones.includes(requestedTone)
      ? requestedTone
      : 'friendly';

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content:
          'You are a YouTube creator answering comments under your video. ' +
          'Write one short reply that fits the requested tone. ' +
          'Keep the reply suitable for a public YouTube comment section. ' +
          'Do not include harmful, hateful, or misleading content. ' +
          'Do not claim to be a human if that is not needed. ' +
          'Return only the reply text, without quotation marks or extra labels.',
      },
      {
        role: 'user',
        content:
          `Tone: ${tone}\n` +
          `YouTube comment: ${commentText}\n` +
          'Write a reply to this comment.',
      },
    ];

    const data = await fetchData<ChatCompletionResponse>(
      getOpenAiUrl('v1/chat/completions'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages,
          temperature: 0.8,
          max_tokens: 200,
        }),
      }
    );

    const reply = data.choices[0]?.message?.content?.trim();

    if (!reply) {
      throw new CustomError('The model did not return a comment reply', 502);
    }

    res.json({ response: reply });
  } catch (error) {
    next(error);
  }
};

export { commentPost };
