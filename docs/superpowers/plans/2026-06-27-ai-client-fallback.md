# AI Client Fallback Mechanism Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a fallback mechanism in `AIClient` to rotate across three API keys (Gemini 1 -> Groq -> Gemini 2) in case of errors.

**Architecture:** Loop through configurations dynamically built from available environment variables, lazily instantiating clients (`GoogleGenAI` and `OpenAI`) as needed, and throwing consolidated errors if all fail.

**Tech Stack:** TypeScript, Next.js, `@google/genai`, `openai`, Jest

## Global Constraints
* Keep TypeScript type-safety intact.
* Do not import libraries that are not in `package.json`.
* Do not introduce breaking changes to existing signatures of `AIClient` (`generateContent` returns `Promise<string | undefined>`).

---

### Task 1: Environment Variables configuration

**Files:**
- Modify: `src/lib/constants/env.ts`
- Modify: `.env.example`

**Interfaces:**
- Consumes: `process.env.GROQ_API_KEY`, `process.env.GEMINI_API_KEY_2`
- Produces: `envConfig.GroqApiKey` (string | undefined), `envConfig.GeminiApiKey2` (string | undefined)

- [ ] **Step 1: Add variables to env.ts**
  Add `GroqApiKey` and `GeminiApiKey2` properties to `envConfig` in `src/lib/constants/env.ts`.
- [ ] **Step 2: Add variables to .env.example**
  Add placeholders for `GROQ_API_KEY` and `GEMINI_API_KEY_2` to `.env.example`.
- [ ] **Step 3: Commit**
  Commit the changes.

---

### Task 2: AIClient client refactor

**Files:**
- Modify: `src/ai/client.ts`

**Interfaces:**
- Consumes: `envConfig`
- Produces: Updated `AIClient` class with loop-based fallback over Gemini and Groq.

- [ ] **Step 1: Implement Chain-of-Providers logic**
  Implement `ProviderConfig` interface and rewrite `AIClient` to dynamically build `getActiveProviders()`. Add helper methods `getGeminiClient` and `getGroqClient` for lazy client instantiation. Update `generateContent` to loop through active providers and handle errors/fallbacks.
- [ ] **Step 2: Commit**
  Commit the changes.

---

### Task 3: Unit Tests and Verification

**Files:**
- Modify: `src/__tests__/ai.client.test.ts`

**Interfaces:**
- Consumes: `AIClient`
- Produces: Comprehensive test coverage for multi-provider fallback.

- [ ] **Step 1: Mock OpenAI client and updated envConfig**
  Modify test file mocks to mock `openai` SDK and define mock values for `GroqApiKey` and `GeminiApiKey2`.
- [ ] **Step 2: Write failing/new tests**
  Add unit tests validating:
  * Primary Gemini succeeds.
  * Gemini 1 fails, falls back to Groq, which succeeds.
  * Gemini 1 and Groq fail, falls back to Gemini 2, which succeeds.
  * All providers fail, throws consolidated error.
- [ ] **Step 3: Run Jest tests**
  Run tests using `bun x jest src/__tests__/ai.client.test.ts` to ensure everything compiles and passes.
- [ ] **Step 4: Commit**
  Commit the test changes.
