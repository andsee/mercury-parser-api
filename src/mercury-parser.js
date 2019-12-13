import Mercury from '@postlight/mercury-parser';

import { corsSuccessResponse, corsErrorResponse, runWarm } from './utils';

const mercuryParser = async ({ queryStringParameters }) => {
  let result = null;
  const { url } = queryStringParameters;
  let { contentType } = queryStringParameters;
  if (!contentType) {
    contentType = 'text';
  }
  console.log(`Parse: ${url} , ${contentType}`);
  try {
    result = await Mercury.parse(url, { contentType });
    if (contentType === 'text') {
      const input = result.content.trim();
      // (\s*([\n\r]|(\\n))+\s*)+
      // console.log(`Input:\n`+JSON.stringify(input));
      result.content = input.replace(/(\s*([\n\r]|(\\n))+\s*)+/g, '\n');
      // console.log(`Results:\n`+result.content);
    }
    console.log(`Result: ${JSON.stringify(result)}`);
  } catch (e) {
    console.log(`Exception: ${JSON.stringify(e)}`);
  }
  return result
    ? corsSuccessResponse(result)
    : corsErrorResponse({ message: 'There was an error parsing that URL.' });
};

export default runWarm(mercuryParser);
