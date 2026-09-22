import {ErrorResponse} from '../types/MessageTypes';

const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // console.log('fetching data from url: ', url);
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    // kokeile joskus: throw response;
    const errorJson = json as unknown as ErrorResponse & {
      error?: {message?: string};
    };
    const message = errorJson.message || errorJson.error?.message;
    if (message) {
      throw new Error(message);
    }
    throw new Error(`Error ${response.status} occured`);
  }
  return json;
};

export default fetchData;
