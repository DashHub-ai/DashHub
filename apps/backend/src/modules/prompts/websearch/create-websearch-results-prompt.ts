import type { SearchEngineResultItem } from '~/modules/search-engines/clients/search-engine-proxy';

import { xml } from '../xml';

export function createWebSearchResultsPrompt(results: SearchEngineResultItem[]): string {
  const instructions = xml('instructions', {
    children: [
      xml('rule', { children: ['ALWAYS cite sources'] }),
      xml('rule', { children: ['Place citations immediately after information from that source'] }),
      xml('rule', { children: ['When citing multiple pieces of information from the same source, cite each one separately'] }),
      xml('rule', { children: ['Never combine multiple sources into a single citation'] }),
      xml('rule', { children: ['Analyze all provided search results equally, not just the first one'] }),
      xml('rule', { children: ['Extract factual information from the results and present it objectively'] }),
      xml('rule', { children: ['If results contain conflicting information, acknowledge the differences and cite sources for each claim'] }),
      xml('rule', { children: ['If no results are found, clearly state that you cannot provide information from web sources'] }),
      xml('rule', { children: ['Do not make assumptions beyond what is explicitly stated in the search results'] }),
    ],
  });

  if (!results.length) {
    return xml('web-search-results', {
      children: [
        instructions,
        'No results found',
      ],
    });
  }

  return xml('web-search-results', {
    children: [
      instructions,
      xml('displayFormats', {
        children: [
          xml('weatherFormat', {
            children: [
              xml('rule', { children: ['Start with a header showing location and current temperature'] }),
              xml('rule', { children: ['Present weather forecasts in a markdown table format - no exceptions'] }),
              xml('rule', { children: ['Use appropriate weather emojis: ☀️(sunny), ⛅(partly cloudy), 🌧️(rain), ⛈️(storm), 🌨️(snow)'] }),
              xml('rule', { children: ['Include temperature, precipitation chance, and wind speed in the table'] }),
              xml('rule', { children: ['Include any additional notes relevant to the forecast'] }),
            ],
          }),
          xml('structuredDataFormat', {
            children: [
              xml('rule', { children: ['Present structured data (prices, ratings, statistics) in organized tables'] }),
              xml('rule', { children: ['Use markdown headers (##) for clear section separation'] }),
              xml('rule', { children: ['Format lists with (*) for better readability'] }),
              xml('rule', { children: ['Use parallel structure in lists or tables for comparisons and pros/cons'] }),
            ],
          }),
        ],
      }),
      ...results.map(result =>
        xml('result', {
          children: [
            xml('title', { children: [result.title] }),
            xml('description', { children: [result.description] }),
            xml('url', { children: [result.url] }),
          ],
        }),
      ),
    ],
  });
}
