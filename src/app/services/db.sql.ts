import { Entities } from '../entities/Entities';
import { Util } from '../components/utilities/utility';

export class SQL {
    static CREATE_OPTIONS: string = `CREATE TABLE IF NOT EXISTS options(
        lid INTEGER PRIMARY KEY AUTOINCREMENT,
        id INTEGER,
        action TEXT NOT NULL,
        module TEXT NOT NULL,
        edition TEXT NOT NULL,
        UNIQUE(action, module));`;
    static CREATE_PROFILES: string = `CREATE TABLE IF NOT EXISTS profiles(
        lid INTEGER PRIMARY KEY AUTOINCREMENT,
        id INTEGER,
        name TEXT NOT NULL,
        edition TEXT NOT NULL,
        UNIQUE(name));`;
    static CREATE_SYNCHRONIZATIONS: string = `CREATE TABLE IF NOT EXISTS synchronizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity TEXT NOT NULL,
        edition TEXT NOT NULL,
        ledition TEXT NOT NULL);`;
    static DATABASE: string = 'knowing.db';
    static LOCATION: string = 'default';
    static ALL(table: Table) { return `SELECT * FROM ${table};`; }
    static DELETE(lid: Number, table: Table) { return `DELETE FROM ${table} WHERE lid=${lid};` }
    static DELETE_ID_NOT_IN(ids: Number[], table: Table) { return `DELETE FROM ${table} WHERE id NOT IN(${ids}) OR id IS NULL;` }
    static IDS(table: Table): string { return `SELECT id FROM ${table} WHERE id IS NOT NULL;`; }
    static EXIST_PROFILE(profile: Entities.Profile) { return `SELECT COUNT(0) exist FROM profiles WHERE lid<>${profile.lid ? profile.lid : 0} AND UPPER(name)=UPPER('${profile.name}');`; }
    static INSERT_OPTIONS(options: Entities.Option[]) {
        return `INSERT INTO options (id, action, module, edition) 
            VALUES ${options.map(o => `(${o.id}, '${o.action}', '${o.module}', '${Util.getDate()}')`)};`;
    }
    static INSERT_PROFILES(profiles: Entities.Profile[]) {
        return `INSERT INTO profiles (id, name, edition) 
            VALUES ${profiles.map(p => `(${p.id}, '${p.name}', '${Util.getDate()}')`)};`;
    }
    static INSERT_SYNCHRONIZATION(tables: string[]): string {
        return `INSERT INTO synchronizations(entity,edition,ledition) 
            VALUES ${tables.map(t => `('${t}','2000-01-01 00:00:00','2000-01-01 00:00:00')`)};`
    }
    static UPDATE_OPTIONS(option: Entities.Option) {
        return `UPDATE options 
            SET action='${option.action}', module='${option.module}', edition='${Util.getDate()}' 
            WHERE id=${option.id};`
    }
    static UPDATE_PROFILES(profile: Entities.Profile) {
        return `UPDATE profiles 
            SET name='${profile.name}', edition='${Util.getDate()}' 
            WHERE id=${profile.id};`
    }
    static UPDATE_PROFILES_LOCAL(profile: Entities.Profile) {
        return `UPDATE profiles 
            SET name='${profile.name}', edition='${Util.getDate()}' 
            WHERE lid=${profile.lid};`
    }
    static UPDATE_SYNCHRONIZATION(edition: string, table: Table): string {
        return `UPDATE synchronizations 
            SET edition='${edition}',ledition='${Util.getDate()}'
            WHERE entity='${table}';`
    }
}

export enum Table {
    options = "options",
    profiles = "profiles",
    synchronizations = "synchronizations"
}