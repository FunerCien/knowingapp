import { Entities } from '../entities/Entities';
import { Util } from '../components/utilities/utility';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Observable, Observer } from 'rxjs';

export class SQL {
    private static completeObserver(observer: Observer<any>, value: any) {
        observer.next(value);
        observer.complete();
    }
    static CREATE_COORDINATIONS: string = `CREATE TABLE IF NOT EXISTS coordinations(
        lid INTEGER PRIMARY KEY AUTOINCREMENT,
        id INTEGER,
        edition TEXT NOT NULL,
        coordinated INTEGER NOT NULL,
        coordinator INTEGER NOT NULL,
        lcoordinated INTEGER NOT NULL,
        lcoordinator INTEGER NOT NULL,
        UNIQUE(lcoordinated,lcoordinator));`;
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
    static ALL(table: Table): string { return `SELECT * FROM ${table};`; }
    static DELETE(lid: Number, table: Table): string { return `DELETE FROM ${table} WHERE lid=${lid};` }
    static DELETE_ID_NOT_IN(ids: Number[], table: Table): string { return `DELETE FROM ${table} WHERE id NOT IN(${ids}) OR id IS NULL;` }
    static IDS(table: Table): string { return `SELECT id FROM ${table} WHERE id IS NOT NULL;`; }
    static EXIST_COORDINATION(coordination: Entities.Coordination): string { return `SELECT COUNT(0) exist FROM coordinations WHERE lid<>${coordination.lid ? coordination.lid : 0} AND lcoordinated=${coordination.lcoordinated} AND lcoordinator=${coordination.lcoordinator};`; }
    static EXIST_PROFILE(profile: Entities.Profile): string { return `SELECT COUNT(0) exist FROM profiles WHERE lid<>${profile.lid ? profile.lid : 0} AND UPPER(name)=UPPER('${profile.name}');`; }
    static INSERT_COORDINATIONS(coordinations: Entities.Coordination[], selectAllProfiles: Observable<Entities.Profile[]>): Observable<string> {
        return Observable.create((o: Observer<String>) => {
            selectAllProfiles.subscribe(pro => {console.log(pro)
                coordinations.forEach(c => {
                    c.lcoordinated = pro.filter(p => p.id = c.coordinated.id)[0].lid;
                    c.lcoordinator = pro.filter(p => p.id = c.coordinator.id)[0].lid;
                });console.log(`INSERT INTO coordinations (id,edition,coordinated,coordinator,lcoordinated,lcoordinator)
                VALUES ${coordinations.map(c => `(${c.id},'${Util.getDate()}',${c.coordinated.id},${c.coordinator.id},${c.lcoordinated},${c.lcoordinator})`)};`)
                this.completeObserver(o, `INSERT INTO coordinations (id,edition,coordinated,coordinator,lcoordinated,lcoordinator)
                    VALUES ${coordinations.map(c => `(${c.id},'${Util.getDate()}',${c.coordinated.id},${c.coordinator.id},${c.lcoordinated},${c.lcoordinator})`)};`);
            });
        });
    }
    static INSERT_OPTIONS(options: Entities.Option[]): Observable<string> {
        return Observable.create((o: Observer<string>) => this.completeObserver(o, `INSERT INTO options (id,action,module,edition) 
            VALUES ${options.map(o => `(${o.id}, '${o.action}', '${o.module}', '${Util.getDate()}')`)};`));
    }
    static INSERT_PROFILES(profiles: Entities.Profile[]): Observable<string> {console.log(profiles)
        return Observable.create((o: Observer<string>) => {this.completeObserver(o, `INSERT INTO profiles (id,name,edition) 
            VALUES ${profiles.map(p => `(${p.id}, '${p.name}', '${Util.getDate()}')`)};`);console.log(`INSERT INTO profiles (id,name,edition) 
            VALUES ${profiles.map(p => `(${p.id}, '${p.name}', '${Util.getDate()}')`)};`)});
    }
    static INSERT_SYNCHRONIZATION(tables: string[]): Observable<string> {
        return Observable.create((o: Observer<string>) => this.completeObserver(o, `INSERT INTO synchronizations(entity,edition,ledition) 
            VALUES ${tables.map(t => `('${t}','2000-01-01 00:00:00','2000-01-01 00:00:00')`)};`));
    }
    static UPDATE_COORDINATIONS(coordination: Entities.Coordination): Observable<string> {
        return Observable.create((o: Observer<string>) => this.completeObserver(o, `UPDATE profiles 
            SET edition='${Util.getDate()}',coordinated=${coordination.coordinated.id},coordinator=${coordination.coordinator.id},lcoordinated=${coordination.lcoordinated},lcoordinator=${coordination.lcoordinator}
            WHERE id=${coordination.id};`));
    }
    static UPDATE_OPTIONS(option: Entities.Option): Observable<string> {
        return Observable.create((o: Observer<string>) => this.completeObserver(o, `UPDATE options 
            SET action='${option.action}',module='${option.module}', edition='${Util.getDate()}' 
            WHERE id=${option.id};`));
    }
    static UPDATE_PROFILES(profile: Entities.Profile): Observable<string> {
        return Observable.create((o: Observer<string>) => this.completeObserver(o, `UPDATE profiles 
            SET name='${profile.name}', edition='${Util.getDate()}' 
            WHERE id=${profile.id};`));
    }
    static UPDATE_COORDINATIONS_LOCAL(coordination: Entities.Coordination) {
        return `UPDATE profiles 
            SET edition='${Util.getDate()}',coordinated=${coordination.coordinated.id},coordinator=${coordination.coordinator.id},lcoordinated=${coordination.lcoordinated},lcoordinator=${coordination.lcoordinator}
            WHERE lid=${coordination.lid};`
    }
    static UPDATE_PROFILES_LOCAL(profile: Entities.Profile) {
        return `UPDATE profiles 
            SET name='${profile.name}', edition='${Util.getDate()}' 
            WHERE lid=${profile.lid};`
    }
    static UPDATE_SYNCHRONIZATION(edition: string, table: Table): Observable<string> {
        return Observable.create((o: Observer<string>) => this.completeObserver(o, `UPDATE synchronizations 
            SET edition='${edition}',ledition='${Util.getDate()}'
            WHERE entity='${table}';`));
    }
}

export enum Table {
    coordinations = "coordinations",
    options = "options",
    profiles = "profiles",
    synchronizations = "synchronizations"
}