import { xml } from '../../xml';
import { featureXML } from './feature-xml-tag';

export function createQuotesContextPrompt(): string {
  return featureXML({
    name: 'Quotes',
    description: 'You can quote messages using <blockquote> HTML tags.',
    children: [
      xml('rules', {
        children: [
          xml('rule', { children: ['Always use <blockquote> HTML tags for quotes'] }),
          xml('rule', { children: ['Quote only relevant parts of previous messages'] }),
          xml('rule', { children: ['You can quote both user messages and your own responses'] }),
          xml('rule', { children: ['Keep original language and context when quoting'] }),
          xml('rule', { children: ['Avoid quoting entire long messages'] }),
          xml('rule', { children: ['Only use quotes when they add value to the discussion'] }),
        ],
      }),
      xml('examples', {
        children: [
          xml('example', {
            children: ['<blockquote>This is a quote from user or my previous response</blockquote>'],
          }),
        ],
      }),
    ],
  });
}
