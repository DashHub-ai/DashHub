import type { MatchingEmbedding } from './utils/types';

import { xml } from '../xml';
import { embeddingsXML, groupEmbeddingsByFile } from './utils';

export function createRelevantEmbeddingsPrompt(embeddings: MatchingEmbedding[]): string | null {
  const groupedEmbeddings = Object.values(groupEmbeddingsByFile(embeddings));

  if (!groupedEmbeddings.length) {
    return null;
  }

  const contextContent = groupedEmbeddings
    .slice(0, 10)
    .map(({ file, fragments }) =>
      xml('file-context', {
        attributes: {
          name: file.name,
          description: 'Content from this file (with embeddings identifiers)',
        },
        children:
            fragments
              .slice(0, 10)
              .map(({ text, id, isInternalKnowledge }) =>
                xml('embedding', {
                  attributes: {
                    id,
                    isInternalKnowledge,
                  },
                  children: [text],
                }),
              ),
      }),
    )
    .join('\n');

  return embeddingsXML({
    children: [
      xml('context', { children: [contextContent] }),
      xml('core-instructions', {
        children: groupedEmbeddings.length
          ? [
              xml('instruction', { children: ['Respond in the same language as the user\'s prompt'] }),
              xml('instruction', { children: ['If message contains #app mention: MAINTAIN THE APP\'S PERSONALITY AND TONE throughout the response'] }),
              xml('instruction', { children: ['Provide natural, conversational responses while incorporating relevant context when appropriate'] }),
              xml('instruction', { children: ['Focus on answering the user\'s question directly and clearly'] }),
              xml('instruction', { children: ['For translation requests: translate content directly without additional commentary'] }),
              xml('instruction', { children: ['Use available context to enhance your response, but don\'t force references if not relevant'] }),
              xml('instruction', {
                attributes: {
                  description: 'When using information from files',
                },
                children: [
                  xml('point', { children: ['First mention: cite source using footnote [^1] and provide detailed explanation'] }),
                  xml('point', { children: ['Subsequent mentions: refer back to earlier explanation without repeating the source'] }),
                  xml('point', { children: ['Only cite new, unique information from files'] }),
                  xml('point', { children: ['For internal knowledge content (isInternalKnowledge), ALWAYS state it comes from "knowledge provided to the assistant" and cite with footnote'] }),
                ],
              }),
              xml('instruction', {
                children: ['When using internal knowledge, ALWAYS refer to it as "based on knowledge provided to the assistant" without referencing specific files'],
              }),
              xml('instruction', { children: ['For internal knowledge content, make it explicit this comes from the knowledge provided to the assistant'] }),
              xml('instruction', { children: ['Keep footnotes short (one sentence) and include embedding ID when citing sources, EXCEPT for app knowledge'] }),
              xml('instruction', {
                attributes: {
                  description: 'When user specifically asks about files or content',
                },
                children: [
                  xml('point', { children: ['Prioritize information from attached files in the current chat'] }),
                  xml('point', { children: ['Use other available context to provide comprehensive answers'] }),
                  xml('point', { children: ['Make it clear which information comes from files vs knowledge provided to the assistant'] }),
                ],
              }),
              xml('instruction', { children: ['Don\'t use ✅ or ❌ in responses unless the user uses them first'] }),
              xml('instruction', { children: ['Prefer to use knowledge from the project files over general knowledge'] }),
              xml('instruction', { children: ['If application is used, follow the app-specific guidelines for responses'] }),
            ]
          : [
              xml('instruction', { children: ['Respond in the same language as the user\'s prompt'] }),
              xml('instruction', { children: ['Provide a natural, conversational response'] }),
              xml('instruction', { children: ['If the user specifically asks about files or content, explain that no relevant content was found'] }),
              xml('instruction', { children: ['Offer helpful general information or suggestions when appropriate'] }),
              xml('instruction', { children: ['Focus on being helpful while staying within your knowledge boundaries'] }),
            ],
      }),
      xml('citation-guidelines', {
        children: [
          xml('rule', { children: ['Add footnotes only for first mention of specific information'] }),
          xml('rule', { children: ['For regular files - Format: [^1]: Fragment #embedding:123 contains relevant details.'] }),
          xml('rule', { children: ['For internal knowledge - Format: [^1]: Based on knowledge provided to the assistant'] }),
          xml('rule', { children: ['Keep references natural and only when meaningful'] }),
          xml('rule', { children: ['For internal knowledge, NEVER reference specific files or embedding IDs'] }),
          xml('rule', { children: ['Citations are MANDATORY for internal knowledge and should ALWAYS mention "knowledge provided to the assistant"'] }),
          xml('rule', { children: ['Citations are optional for other content unless specifically referencing new file content'] }),
        ],
      }),
      xml('citation-scenarios', {
        children: [
          xml('skip-citations', {
            children: [
              xml('scenario', { children: ['General knowledge responses'] }),
              xml('scenario', { children: ['Direct translations'] }),
              xml('scenario', { children: ['Simple yes/no answers'] }),
              xml('scenario', { children: ['Conceptual explanations'] }),
              xml('scenario', { children: ['When user hasn\'t asked about sources'] }),
            ],
          }),
          xml('include-citations', {
            children: [
              xml('scenario', { children: ['When directly quoting or referencing file content'] }),
              xml('scenario', { children: ['When answering specific questions about files'] }),
              xml('scenario', { children: ['When providing technical details from documentation'] }),
              xml('scenario', { children: ['When user asks for source information'] }),
              xml('scenario', { children: ['ALWAYS when using internal knowledge (isInternalKnowledge)'] }),
            ],
          }),
        ],
      }),
    ],
  });
}
