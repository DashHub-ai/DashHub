import type OpenAI from 'openai';

export function createWebSearchFunctionTool(): OpenAI.Chat.Completions.ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: 'WebSearch',
      description: 'Search the web for information. This function will return a list of search results based on the input query.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The query to search for on the web.',
          },
          language: {
            type: 'string',
            description: 'The language in which to conduct the search. It\'s code should be in ISO 639-1 format.',
          },
          results: {
            type: 'integer',
            description: 'Maximum number of search results to return. Maximum value is 30.',
          },
        },
        required: ['query', 'language', 'results'],
      },
    },
  };
}
