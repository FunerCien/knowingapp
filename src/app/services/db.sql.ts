import { Entities } from '../entities/Entities';
import { Util } from '../components/utilities/utility';

export class SQL {
    static CREATE_COORDINATIONS: string = `CREATE TABLE IF NOT EXISTS coordinations(
        lid INTEGER PRIMARY KEY AUTOINCREMENT,
        id INTEGER,
        edition TEXT NOT NULL,
        rcoordinated INTEGER NOT NULL,
        rcoordinator INTEGER NOT NULL,
        lcoordinated INTEGER NOT NULL,
        lcoordinator INTEGER NOT NULL,
        UNIQUE(lcoordinated,lcoordinator));`;
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
    static ALL(table: Table): string { return `SELECT * FROM ${table};`; }
    static DELETE(lid: Number, table: Table): string { return `DELETE FROM ${table} WHERE lid=${lid};` }
    static DELETE_ID_NOT_IN(ids: Number[], table: Table): string { return `DELETE FROM ${table} WHERE id NOT IN(${ids}) OR id IS NULL;` }
    static ID_LID(table: Table): string { return `SELECT id, lid FROM ${table};`; }
    static IDS(table: Table): string { return `SELECT id FROM ${table} WHERE id IS NOT NULL;`; }
    static EXIST_COORDINATION(coordination: Entities.Coordination): string { return `SELECT COUNT(0) exist FROM coordinations WHERE lid<>${coordination.lid ? coordination.lid : 0} AND lcoordinated=${coordination.lcoordinated} AND lcoordinator=${coordination.lcoordinator};`; }
    static EXIST_PROFILE(profile: Entities.Profile): string { return `SELECT COUNT(0) exist FROM profiles WHERE lid<>${profile.lid ? profile.lid : 0} AND UPPER(name)=UPPER('${profile.name}');`; }
    static INSERT_COORDINATIONS(coordinations: Entities.Coordination[], idLidProfiles: any[]): string {
        idLidProfiles.forEach(p => {
            coordinations.forEach(c => {
                if (p.id) {
                    if (c.coordinated.id == p.id) c.lcoordinated = p.lid;
                    if (c.coordinator.id == p.id) c.lcoordinator = p.lid;
                }
            });
        });
        return `INSERT INTO coordinations (id,edition,rcoordinated,rcoordinator,lcoordinated,lcoordinator)
            VALUES ${coordinations.map(c => `(${c.id},'${Util.getDate()}',${c.coordinated.id},${c.coordinator.id},${c.lcoordinated},${c.lcoordinator})`)};`;
    }
    static INSERT_PROFILES(profiles: Entities.Profile[]): string {
        return `INSERT INTO profiles (id,name,edition) 
            VALUES ${profiles.map(p => `(${p.id}, '${p.name}', '${Util.getDate()}')`)};`
    }
    static INSERT_SYNCHRONIZATION(tables: string[]): string {
        return `INSERT INTO synchronizations(entity,edition,ledition) 
            VALUES ${tables.map(t => `('${t}','2000-01-01 00:00:00','2000-01-01 00:00:00')`)};`
    }
    static UPDATE_COORDINATIONS(coordination: Entities.Coordination, idLidProfiles: any[]): string {
        idLidProfiles.forEach(p => {
            if (coordination.coordinated.id == p.id) coordination.lcoordinated = p.lid;
            if (coordination.coordinator.id == p.id) coordination.lcoordinator = p.lid;
        });
        return `UPDATE coordinations 
            SET edition='${Util.getDate()}',rcoordinated=${coordination.coordinated.id},rcoordinator=${coordination.coordinator.id},lcoordinated=${coordination.lcoordinated},lcoordinator=${coordination.lcoordinator}
            WHERE id=${coordination.id};`
    }
    static UPDATE_PROFILES(profile: Entities.Profile): string {
        return `UPDATE profiles 
            SET name='${profile.name}', edition='${Util.getDate()}' 
            WHERE id=${profile.id};`
    }
    static UPDATE_COORDINATIONS_LOCAL(coordination: Entities.Coordination, idLidProfiles: any[]) {
        idLidProfiles.forEach(p => {
            if (coordination.coordinated.lid == p.lid) coordination.coordinated.id = p.id;
            if (coordination.coordinator.lid == p.lid) coordination.coordinator.id = p.id;
        });
        return `UPDATE coordinations 
            SET edition='${Util.getDate()}',rcoordinated=${coordination.coordinated.id},rcoordinator=${coordination.coordinator.id},lcoordinated=${coordination.lcoordinated},lcoordinator=${coordination.lcoordinator}
            WHERE lid=${coordination.lid};`
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
    coordinations = "coordinations",
    profiles = "profiles",
    synchronizations = "synchronizations"
}