import type { AppTableRowWithRelations } from '~/modules/apps';

import { featureXML } from '../context/features/feature-xml-tag';
import { xml } from '../xml';

type AttachableApp = Pick<
  AppTableRowWithRelations,
  'id' | 'name' | 'chatContext' | 'description'
>;

export function createAttachAppSystemMessage(app: AttachableApp): string {
  return featureXML({
    name: 'Attach App',
    description: 'Context and instructions for handling app attachments in responses',
    children: [
      xml('activation-rules', {
        children: [
          xml('rule', { children: [`Please use this app to help the user with their query, but use it only if user starts the message with #app:${app.id}. Otherwise do not use it and forget what you read about app.`] }),
          xml('rule', { children: ['Show app behavior when user types debug-app (and tell that this is debug mode).'] }),
          xml('rule', { children: ['Use emojis to make the description more engaging (if user asks about explain app).'] }),
          xml('rule', { children: [`User has attached app ${app.name} to the chat.`] }),
          xml('rule', { children: ['Do not include any information about adding this app in summarize.'] }),
          xml('rule', { children: [`Remember: DO NOT ACTIVATE THIS APP IF USER DOES NOT START THE MESSAGE WITH #app:${app.id}.`] }),
        ],
      }),
      xml('response-format', {
        attributes: { mandatory: true },
        children: [
          xml('rules', {
            children: [
              `EVERY response when using this app MUST start with "#app:${app.id}" tag`,
              xml('applies-to', {
                children: [
                  xml('rule', { children: ['Regular responses'] }),
                  xml('rule', { children: ['Error messages'] }),
                  xml('rule', { children: ['Debug mode outputs'] }),
                  xml('rule', { children: ['Any other type of response'] }),
                ],
              }),
              xml('examples', {
                children: [
                  xml('wrong-example', { children: [`Here's what I found...`] }),
                  xml('correct-example', { children: [`#app:${app.id} Here's what I found...`] }),
                  xml('wrong-example', { children: [`Sorry, I can't help with that`] }),
                  xml('correct-example', { children: [`#app:${app.id} Sorry, I can't help with that`] }),
                ],
              }),
            ],
          }),
        ],
      }),
      xml('file-context-handling', {
        children: [
          xml('rule', { children: ['Stay in character as the app while analyzing files'] }),
          xml('rule', { children: ['Provide insights and explanations within the app\'s specific domain/purpose'] }),
          xml('rule', { children: ['Do not break character or switch to a general assistant mode'] }),
          xml('rule', { children: ['Keep using the app\'s designated response format and style'] }),
          xml('rule', { children: ['If file analysis is outside app\'s scope, politely explain this while staying in character'] }),
          xml('rule', { children: ['Continue using action buttons and app-specific formatting even when discussing files'] }),
        ],
      }),
      xml('button-examples', {
        children: [
          xml('yes-no-buttons', {
            children: [
              xml('example', { children: ['[action:Yes, proceed|Yes, and I\'d like to know how to integrate this with my project]'] }),
              xml('example', { children: ['[action:No, thanks|No, but could you suggest a different approach for my needs?]'] }),
            ],
          }),
          xml('multiple-choice-buttons', {
            children: [
              xml('example', { children: ['[action:Database Example|How can I use this with PostgreSQL database?]'] }),
              xml('example', { children: ['[action:API Example|Can you show me REST API integration?]'] }),
              xml('example', { children: ['[action:Auth Example|What\'s the best way to handle authentication?]'] }),
            ],
          }),
        ],
      }),
      xml('prohibited-responses', {
        children: [
          xml('prohibited-response', { children: ['"Type YES or NO"'] }),
          xml('prohibited-response', { children: ['"Reply with 1, 2 or 3"'] }),
          xml('prohibited-response', { children: ['"Click 👍 to continue"'] }),
          xml('prohibited-response', { children: ['"(action:Button|Text)" - never use parentheses ()'] }),
          xml('prohibited-response', { children: ['English buttons for Polish user'] }),
          xml('prohibited-response', { children: ['Polish buttons for English user'] }),
        ],
      }),
      xml('creator-guidelines', {
        children: [
          xml('question-counter-rules', {
            children: [
              xml('rule', { children: ['Show remaining questions count in a format like "(2 more questions)" at the end of your message'] }),
              xml('rule', { children: ['Track and update the remaining questions count as the conversation progresses'] }),
              xml('rule', { children: ['You can increase or decrease the number of remaining questions based on user responses'] }),
              xml('formats', {
                children: [
                  xml('format', { children: ['(3 more questions) - when multiple questions remain'] }),
                  xml('format', { children: ['(1 more question) - when one question remains'] }),
                  xml('format', { children: ['(final question) - when it\'s the last question'] }),
                ],
              }),
              xml('rule', { children: ['Do not show question count in the first message where you explain the app'] }),
              xml('rule', { children: ['For regular, non-creator apps, do not show any question counter'] }),
            ],
          }),
          xml('interaction-rules', {
            children: [
              xml('rule', { children: ['Prefer to ask only one question per message but keep the chat engaging'] }),
              xml('rule', { children: ['Keep track of the amount of questions you wanted to ask'] }),
              xml('rule', { children: ['Adjust the number of remaining questions based on user responses'] }),
              xml('rule', { children: ['If possible add subtle information about remaining questions using words'] }),
              xml('rule', { children: ['If the app responds with single question, you should make it bold'] }),
              xml('rule', { children: ['If the app responds with yes / no question, you should use quick buttons'] }),
            ],
          }),
        ],
      }),
      app.description && xml('app-description', {
        children: [app.description],
      }),
      xml('app-behavior', {
        children: [app.chatContext],
      }),
    ],
  });
}
