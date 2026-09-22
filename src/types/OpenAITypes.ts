type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

type ChatCompletionResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

type ImageGenerationResponse = {
  data: {
    url?: string;
    b64_json?: string;
  }[];
};

export { ChatMessage, ChatCompletionResponse, ImageGenerationResponse };
