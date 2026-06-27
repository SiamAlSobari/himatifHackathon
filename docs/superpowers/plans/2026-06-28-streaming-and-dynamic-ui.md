# AI Streaming and Dynamic UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add AI real-time streaming mode to `/chat` and update UI placeholders and styling to dynamically adapt to themes from `src/lib/types/theme.ts`.

**Architecture:**
1. AI Streaming: Implement `generateContentStream` in `AIClient` and `sendChatMessageStream` in `AIService`. Update `processAIResponse` in `ChatService` to stream chunks via Pusher (`chat-chunk` event).
2. UI Streaming: Update `useChatNotification` hook to subscribe to `"chat-chunk"` and invoke `onChunk` callback. Update page state to accumulate chunks as `streamingMessage` and clear it when finished or message starts sending. Pass this state to `<ChatPanel>` to render streamed text dynamically.
3. Placeholder/Session Auto-creation: Automatically call `handleCreateSession` if there is no active session and history list is empty.
4. Dynamic Themes: Adjust styling in `ChatPanel`, `SummarySidebar`, `Wellbeingscorecard`, and `LevelIndicator` to use dynamic theme variables instead of hardcoded `teal` classes.

**Tech Stack:** TypeScript, Next.js, `@google/genai`, `openai`, Tailwind, Pusher, Jest

## Global Constraints
* Maintain strict typing and verify compiles.
* Maintain existing REST structure (REST request returns fast status `processing`, Pusher pushes streaming chunks).
* Do not introduce breaking changes.

---

### Task 1: AI Streaming Backend Refactor

**Files:**
- Modify: `src/ai/client.ts`
- Modify: `src/services/ai.service.ts`
- Modify: `src/services/chat.service.ts`
- Modify: `src/__tests__/ai.service.test.ts`
- Modify: `src/__tests__/ai.client.test.ts`

- [ ] **Step 1: Implement AIClient.generateContentStream**
  Add `generateContentStream(prompt: string, onChunk: (text: string) => void): Promise<string>` to `AIClient` utilizing `@google/genai`'s `generateContentStream` and `openai`'s `stream: true`.
- [ ] **Step 2: Implement AIService.sendChatMessageStream**
  Add `sendChatMessageStream(chatHistory: string, prompt: string, onChunk: (text: string) => void)` to `AIService` wrapping client stream generator.
- [ ] **Step 3: Modify ChatService.processAIResponse for streaming**
  Change AI call in `processAIResponse` to use `sendChatMessageStream` and trigger a `"chat-chunk"` event on pusher server with `{ sessionId, chunk }`.
- [ ] **Step 4: Update Unit Tests**
  Update tests in `src/__tests__/ai.client.test.ts` and `src/__tests__/ai.service.test.ts` to test streaming behavior.
- [ ] **Step 5: Run tests**
  Run Jest tests to verify compilation and passing: `bun x jest`
- [ ] **Step 6: Commit**
  Commit the backend changes.

---

### Task 2: UI Streaming Frontend Integration

**Files:**
- Modify: `src/hooks/chat/useChatNotification.ts`
- Modify: `src/app/validasi/page.tsx`
- Modify: `src/components/chat/ChatPanel.tsx`

- [ ] **Step 1: Update useChatNotification hook**
  Accept `onChunk?: (data: { sessionId: string; chunk: string }) => void` callback and bind to `"chat-chunk"` event.
- [ ] **Step 2: Update ChatPage state**
  Add `streamingMessage` state in `src/app/validasi/page.tsx`. Reset it on new message input or `chat-finished` event. Pass `streamingMessage` to `<ChatPanel>`.
- [ ] **Step 3: Render streaming text in ChatPanel**
  Accept `streamingMessage` prop in `ChatPanel.tsx`. If non-null, display the streaming message in a chat bubble below existing messages instead of the simple typing indicator.
- [ ] **Step 4: Auto-create session if history is empty**
  Add `useEffect` in `src/app/validasi/page.tsx` to automatically call `handleCreateSession` if `history` is empty and no active session or active cooldown exists.
- [ ] **Step 5: Commit**
  Commit the UI streaming changes.

---

### Task 3: Dynamic Theme Styles for Chat Components

**Files:**
- Modify: `src/components/chat/ChatPanel.tsx`
- Modify: `src/components/chat/SummarySidebar.tsx`
- Modify: `src/components/chat/Wellbeingscorecard.tsx`
- Modify: `src/components/chat/LevelIndicator.tsx`

- [ ] **Step 1: Refactor ChatPanel styles**
  Use `activeTheme` to resolve styles dynamically for the start screen icon, button, and loader instead of hardcoding `teal`.
- [ ] **Step 2: Refactor SummarySidebar styles**
  Retrieve theme using `useTheme()` and map icon color classes dynamically.
- [ ] **Step 3: Refactor Wellbeingscorecard styles**
  Retrieve theme using `useTheme()` and map wellbeing score progress bar background color dynamically.
- [ ] **Step 4: Refactor LevelIndicator styles**
  Retrieve theme using `useTheme()` and map symptom analysis indicators dynamically.
- [ ] **Step 5: Verify whole application build**
  Run `bun run build` to ensure Next.js build succeeds with zero errors.
- [ ] **Step 6: Commit**
  Commit the dynamic styling changes.
