import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const files = ['tags.json', 'categories.json', 'products.json'];

files.forEach(file => {
    try {
        const content = readFileSync(join(__dirname, file), 'utf8');
        JSON.parse(content);
        console.log(`✅ ${file} is valid JSON`);
    } catch (error) {
        console.error(`❌ Error in ${file}:`, error.message);
    }
});
