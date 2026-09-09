import Database from 'better-sqlite3'
import {DB_PATH} from '../config/paths'
import {seedFromJson} from "./seed";

let db: Database.Database

export function getDb(): Database.Database {
    if (!db) throw new Error('DB not initialized')
    return db
}

export function initDb(): void {
    db = new Database(DB_PATH)
    db.pragma('foreign_keys = ON')

    db.exec(`
        CREATE TABLE IF NOT EXISTS beans
        (
            id
            TEXT
            PRIMARY
            KEY,
            title
            TEXT
            NOT
            NULL,
            country
            TEXT
            NOT
            NULL,
            description
            TEXT
            NOT
            NULL
            DEFAULT
            '',
            roaster_comment
            TEXT
            NOT
            NULL
            DEFAULT
            '',
            image_url
            TEXT
            NOT
            NULL
            DEFAULT
            '',
            process
            TEXT
            NOT
            NULL
            DEFAULT
            'Unknown',
            region
            TEXT
            NOT
            NULL
            DEFAULT
            'Unknown',
            variety_json
            TEXT
            NOT
            NULL
            DEFAULT
            '[]',
            sca_score
            REAL
            NOT
            NULL
            DEFAULT
            0,
            notes_json
            TEXT
            NOT
            NULL
            DEFAULT
            '[]',
            acidity
            INTEGER
            NOT
            NULL
            DEFAULT
            0,
            sweetness
            INTEGER
            NOT
            NULL
            DEFAULT
            0,
            bitterness
            INTEGER
            NOT
            NULL
            DEFAULT
            0
        );

        CREATE TABLE IF NOT EXISTS recipes
        (
            id
            TEXT
            PRIMARY
            KEY,
            bean_id
            TEXT
            NOT
            NULL,
            method
            TEXT
            NOT
            NULL,
            grind_size
            TEXT
            NOT
            NULL,
            water_temp
            REAL
            NOT
            NULL,
            dose_in
            REAL
            NOT
            NULL,
            dose_out
            REAL
            NOT
            NULL,
            time_total
            TEXT
            NOT
            NULL,
            steps_json
            TEXT
            NOT
            NULL
            DEFAULT
            '[]',
            FOREIGN
            KEY
        (
            bean_id
        ) REFERENCES beans
        (
            id
        ) ON DELETE CASCADE
            );
    `)

    seedFromJson()
}