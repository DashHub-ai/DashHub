import { inject, injectable } from 'tsyringe';

import { xml } from '../../prompts/xml';
import {
  AIEmbeddingGenerateAttrs,
  AIEmbeddingGenerator,
} from './base';
import { TextAIEmbeddingGenerator } from './text-ai-embedding.generator';

@injectable()
export class MarkdownAIEmbeddingGenerator implements AIEmbeddingGenerator {
  constructor(
    @inject(TextAIEmbeddingGenerator) private readonly textEmbeddingGenerator: TextAIEmbeddingGenerator,
  ) {}

  generate = (attrs: Omit<AIEmbeddingGenerateAttrs, 'chunkFn'>) => this.textEmbeddingGenerator.generate({
    ...attrs,
    chunkFn: (text) => {
      const lines = text.split('\n');
      const chunks: string[] = [];

      // Find file title from first H1 header
      let fileTitle = '';
      for (const line of lines) {
        // Check if line is an H1 header
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        const h1Match = line.match(/^#\s+(.+)$/);
        if (h1Match) {
          fileTitle = h1Match[1].trim();
          break;
        }
      }

      // Track section structure
      const headerStack: { level: number; title: string; }[] = [];
      let currentChunk: string[] = [];
      let currentSectionLevel = 0;
      let currentSectionTitle = '';

      // Process all lines
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Check if line is a header
        // eslint-disable-next-line regexp/no-super-linear-backtracking
        const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);

        if (headerMatch) {
          // If we have collected content, save it as a chunk
          if (currentChunk.length > 0 && currentSectionTitle) {
            const parentSection = headerStack.length > 1
              ? headerStack[headerStack.length - 2]
              : null;

            const sectionHeader = xml('section', {
              attributes: {
                title: currentSectionTitle,
                level: currentSectionLevel,
                ...(parentSection ? { parentSection: parentSection.title } : {}),
                ...(fileTitle ? { file: fileTitle } : {}),
              },
            });

            chunks.push(`${sectionHeader}\n${currentChunk.join('\n')}`);
            currentChunk = [];
          }

          // Extract header level and title
          const level = headerMatch[1].length;
          const title = headerMatch[2].trim();

          // Update header stack
          while (headerStack.length > 0 && headerStack[headerStack.length - 1].level >= level) {
            headerStack.pop();
          }
          headerStack.push({ level, title });

          currentSectionLevel = level;
          currentSectionTitle = title;

          // Add header line to current chunk
          currentChunk.push(line);
        }
        else {
          // Add content line to current chunk
          currentChunk.push(line);
        }
      }

      // Don't forget the last chunk
      if (currentChunk.length > 0 && currentSectionTitle) {
        const parentSection = headerStack.length > 1
          ? headerStack[headerStack.length - 2]
          : null;

        const sectionHeader = xml('section', {
          attributes: {
            title: currentSectionTitle,
            level: currentSectionLevel,
            ...(parentSection ? { parentSection: parentSection.title } : {}),
            ...(fileTitle ? { file: fileTitle } : {}),
          },
        });

        chunks.push(`${sectionHeader}\n${currentChunk.join('\n')}`);
      }

      return chunks.length > 0 ? chunks : [text];
    },
  });
}
