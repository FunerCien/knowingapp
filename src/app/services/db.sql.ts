import { Entities } from '../entities/Entities';

export class SQL {
    static CREATE_OPTIONS: string = `CREATE TABLE IF NOT EXISTS options(
        id INTEGER PRIMARY KEY,
        action TEXT NOT NULL,
        module TEXT NOT NULL,
        edition TEXT NOT NULL,
        UNIQUE(action, module));`;
    static CREATE_SYNCHRONIZATIONS: string = `CREATE TABLE IF NOT EXISTS synchronizations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        entity TEXT NOT NULL,
        edition TEXT NOT NULL);`;

    static ALL(table: string) { return `SELECT * FROM ${table};`; }
    static COUNT(table: string): string { return `SELECT COUNT(0)=0 empty FROM ${table};`; }
    static DELETE_ID_NOT_IN(ids: Number[], table: string) { return `DELETE FROM ${table} WHERE id NOT IN(${ids});` }
    static IDS(table: string): string { return `SELECT id FROM ${table};`; }
    static INSERT_OPTIONS(options: Entities.Option[]) {
        return `INSERT INTO options (id, action, module, edition) 
            VALUES ${options.map(o => `(${o.id}, '${o.action}', '${o.module}', '${o.edition}')`)};`;
    }
    static INSERT_SYNCHRONIZATION(tables: string[]): string {
        return `INSERT INTO synchronizations(entity,edition) 
            VALUES ${tables.map(t => `('${t}','2000-01-01 00:00:00')`)};`
    }
    static UPDATE_OPTIONS(option: Entities.Option) {
        return `UPDATE options 
            SET action='${option.action}', module='${option.module}', edition='${option.edition}' 
            WHERE id=${option.id};`
    }
    static UPDATE_SYNCHRONIZATION(edition: string, table: string): string {
        return `UPDATE synchronizations 
            SET edition='${edition}' 
            WHERE entity='${table}';`
    }
}