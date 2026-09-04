import * as repo from '../repositories/i18n.repository'
import {XMLParser} from "fast-xml-parser";

export async function getTranslations(lang: string) {
    const xml = await repo.findByLang(lang) //прочитали файл xml string
    if (!xml) {
        throw new Error('NOT_FOUND')
    }
    const xmlParser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_'
    })
    const xmlData = xmlParser.parse(xml) //Парсим xml строку в объект
    const units = xmlData.xliff.file.unit //Забираем только нужное поле unit
    const list = Array.isArray(units) ? units : [units] //Даже если unit не массив возвращаем массив

    const result: Record<string, string> = {};
//Собираем нормализованный объект вида { "ui.add": "Aggiungi", "ui.edit": "Modifica" }
    list.forEach(unit => {
        const key = unit?.['@_id'];
        const value = unit?.segment?.target;

        if (key && value != null) {
            result[key] = String(value);
        }
    });
    return result

}