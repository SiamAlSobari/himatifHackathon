import path from 'path';
import fs from 'fs';

const BASE_DIR = path.join(process.cwd(), 'src/ai/prompts');
const promptCache = new Map<string, string>();
const MAX_CACHE_SIZE = 32;

/**
 * Membaca file prompt dengan mekanisme caching (LRU-like sederhana)
 */
export function loadPrompt(filename: string): string {
    // Jika sudah ada di cache, langsung kembalikan filenya
    if (promptCache.has(filename)) {
        return promptCache.get(filename)!;
    }

    // Gabungkan path
    const filePath = path.join(BASE_DIR, filename);

    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
        throw new Error(`Root Prompt not found: ${filename}`);
    }

    // Baca isi file dengan encoding utf-8
    const content = fs.readFileSync(filePath, 'utf-8');

    // Simpan ke cache sebelum dikembalikan
    if (promptCache.size >= MAX_CACHE_SIZE) {
        // Hapus entri pertama jika cache penuh (Mekanisme FIFO/LRU sederhana)
        const firstKey = promptCache.keys().next().value;
        if (firstKey) promptCache.delete(firstKey);
    }
    promptCache.set(filename, content);

    return content;
}