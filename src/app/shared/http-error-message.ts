import { HttpErrorResponse } from '@angular/common/http';

/**
 * Turns a failed API call into a message for the user.
 * @param error What the call failed with.
 * @param fallback Message for failures with no more specific explanation.
 * @returns The message, or null for a 401: the auth interceptor already signs the user out and shows the login page.
 */
export function describeHttpError(error: unknown, fallback: string): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }
  if (error.status === 401) {
    return null;
  }
  if (error.status === 0) {
    return 'Can\'t reach the server. Check your connection and try again.';
  }
  if (error.status === 400) {
    const messages = validationMessages(error.error);
    if (messages.length) {
      return messages.join(' ');
    }
  }
  return fallback;
}

/**
 * Reads the messages from a Web API 400 body: `{ Message, ModelState: { field: [messages] } }`,
 * or just `{ Message }` when there are no field errors.
 */
function validationMessages(body: unknown): string[] {
  if (typeof body !== 'object' || body === null) {
    return [];
  }
  const { Message, ModelState } = body as { Message?: unknown; ModelState?: unknown };
  if (typeof ModelState === 'object' && ModelState !== null) {
    const fieldMessages = Object.values(ModelState)
      .flatMap(messages => Array.isArray(messages) ? messages : [])
      .filter((message): message is string => typeof message === 'string' && message.trim() !== '');
    if (fieldMessages.length) {
      return fieldMessages;
    }
  }
  return typeof Message === 'string' ? [Message] : [];
}
