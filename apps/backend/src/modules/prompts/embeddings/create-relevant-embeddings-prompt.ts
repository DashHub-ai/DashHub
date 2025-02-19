import type { MatchingEmbedding } from './utils/types';

import { xml } from '../xml';
import { embeddingsXML, groupEmbeddingsByFile } from './utils';

export function createRelevantEmbeddingsPrompt(
  message: string,
  embeddings: MatchingEmbedding[],
): string {
  const groupedEmbeddings = Object.values(groupEmbeddingsByFile(embeddings));

  if (!groupedEmbeddings.length) {
    return message;
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
              .map(({ text, id, isAppKnowledge }) =>
                xml('embedding', {
                  attributes: {
                    id,
                    isAppKnowledge,
                  },
                  children: [text],
                }),
              ),
      }),
    )
    .join('\n');

  return embeddingsXML({
    children: [
      xml('user-prompt', { children: [message] }),
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
                  xml('point', { children: ['For app knowledge content (isAppKnowledge=true), mention it comes from assistant\'s knowledge base without referencing specific files'] }),
                ],
              }),
              xml('instruction', {
                children: ['When using app knowledge, refer to it as "based on assistant\'s knowledge" or "from app\'s knowledge base" without specific file citations'],
              }),
              xml('instruction', { children: ['For app knowledge content, always make it clear this comes from the app\'s own knowledge base'] }),
              xml('instruction', { children: ['Keep footnotes short (one sentence) and include embedding ID when citing sources'] }),
              xml('instruction', {
                attributes: {
                  description: 'When user specifically asks about files or content',
                },
                children: [
                  xml('point', { children: ['Prioritize information from attached files in the current chat'] }),
                  xml('point', { children: ['Use other available context to provide comprehensive answers'] }),
                  xml('point', { children: ['Make it clear which information comes from files vs general knowledge'] }),
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
          xml('rule', { children: ['For app knowledge - Format: [^1]: Based on assistant\'s knowledge base'] }),
          xml('rule', { children: ['Keep references natural and only when meaningful'] }),
          xml('rule', { children: ['For app knowledge, NEVER reference specific files or embedding IDs'] }),
          xml('rule', { children: ['Citations are MANDATORY for app knowledge but should only mention "assistant\'s knowledge" or "app\'s knowledge base"'] }),
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
            ],
          }),
        ],
      }),
    ],
  });
}
