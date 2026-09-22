const getOpenAiUrl = (endpoint: string): string => {
  const baseUrl = process.env.OPENAI_API_URL;

  if (!baseUrl) {
    throw new Error('OPENAI_API_URL is not set');
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return new URL(endpoint, normalizedBase).toString();
};

export default getOpenAiUrl;
