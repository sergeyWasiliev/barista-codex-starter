import {LOCALES_DIR} from "../config/paths";
import {promises as fs} from 'fs'
import path from "path";

export async function findByLang(lang: string): Promise<string | null>{
    const filePath = path.join(LOCALES_DIR, `${lang}.xlf`)
    try {
        const localeXml = await fs.readFile(filePath, 'utf8');
        return localeXml
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }

}