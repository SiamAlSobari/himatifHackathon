# AI Client Fallback Mechanism Design Specification

This document specifies the design for a multi-provider fallback mechanism within the `AIClient` class. It enables seamless rotation across three API keys (Gemini, Groq, and Gemini again) in the event of rate limits, server errors, or other failures.

## Goals
* Seamless failover across Gemini (Key 1) -> Groq (Key 2) -> Gemini (Key 3).
* Skip unconfigured keys gracefully, allowing developers with single keys to run the application without errors.
* Provide clean consolidated error messages when all fallback options fail.
* Retain the existing API signatures so consuming services do not require changes.

## Proposed Changes

### 1. Environment Config
Modify `src/lib/constants/env.ts` to include:
* `GroqApiKey`: `process.env.GROQ_API_KEY`
* `GeminiApiKey2`: `process.env.GEMINI_API_KEY_2`

### 2. Client Class Implementation (`src/ai/client.ts`)
* Re-implement `AIClient` using a provider chain loop.
* Define `ProviderConfig` interface:
  ```typescript
  interface ProviderConfig {
    name: string;
    provider: 'gemini' | 'groq';
    model: string;
    apiKey: string;
  }
  ```
* Lazily construct the provider clients:
  * Gemini client uses `@google/genai` sdk.
  * Groq client uses `openai` sdk with `baseURL: "https://api.groq.com/openai/v1"`.
* Loop through available configurations sequentially, handling failures and logging warning messages.

## Verification Plan

### Automated Tests
Run Jest tests for `AIClient`:
* Mock Gemini and Groq API calls.
* Assert primary model executes successfully.
* Assert fallback to Groq when Gemini 1 fails.
* Assert fallback to Gemini 2 when both Gemini 1 and Groq fail.
* Assert consolidated exception when all fail.
