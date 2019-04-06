import { BehaviorSubject, Observable, forkJoin, from, Observer, concat } from 'rxjs';
import { map, concatMap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Entities } from '../entities/Entities';

@Injectable()
export class DatabaseService {
    private database: SQLiteObject;
    private dbReady = new BehaviorSubject<boolean>(false);
    private tables = ["OPTIONS"];
    constructor(private platform: Platform, private sql: SQLite) { }
    private createOptions(): Observable<any> {
        return from(this.database.executeSql(`CREATE TABLE IF NOT EXISTS options (
            id INTEGER PRIMARY KEY,
            action TEXT NOT NULL,
            module TEXT NOT NULL,
            edition TEXT NOT NULL,
            UNIQUE(action, module));`, []));
    }
    private createSynchronizations(): Observable<any> {
        return concat(from(this.database.executeSql(`CREATE TABLE IF NOT EXISTS synchronizations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            entity TEXT NOT NULL,
            edition TEXT NOT NULL);`, [])), this.insertSynchronizations());//INSERT NO EJECUTA
    }
    private insertSynchronizations(): Observable<any> {
        return this.isEmpty("synchronizations").pipe(concatMap(e => {
            console.log(e);
            if (e) return <Observable<any>>from((this.database.executeSql(`INSERT INTO synchronizations(entity,edition)
              VALUES ${this.tables.map(t => `('${t}','2000-01-01 00:00:00')`)}`, [])));
            // AVERIGUAR RESPUESTA PARA ELSE
        }));
    }
    private isEmpty(table: string): Observable<Boolean> {
        return from(this.select(`SELECT COUNT(0)=0 empty FROM ${table};`)).pipe(map(e => !!e[0].empty));
    }
    private openDb(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            from(this.sql.create({
                location: 'default',
                name: 'knowing.db'
            })).subscribe(d => {
                this.database = d;
                this.dbReady.next(true);
                o.next(forkJoin(this.createOptions(), this.createSynchronizations()));
                o.complete();
            });
        });
    }
    private select(query: string): Observable<any[]> {
        return from(this.database.executeSql(query, [])).pipe(map((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) lists.push(data.rows.item(i));
            return lists;
        }));
    }
    syncUp(): any {
        this.openDb().subscribe(l => console.log(l));

        return forkJoin(this.openDb());
    }

    //**TODO: MIGRARA A OBSERVABLES */

    async openDB2(): Promise<any> {
        return this.platform.ready().then(() => {
            this.sql.create({ location: 'default', name: 'knowing.db' }).then(async (db: SQLiteObject) => {
                this.database = db;
                return this.createOptions2().then(async () => {
                    return this.createProfiles().then(async () => {
                        return this.createSynchronizations2().then(() => this.dbReady.next(true));
                    });
                });
            });
        });
    }

    private async createOptions2() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS options (" +
            "id INTEGER PRIMARY KEY," +
            "action TEXT NOT NULL," +
            "module TEXT NOT NULL," +
            "edition TEXT NOT NULL," +
            "UNIQUE(action, module));", []);
    }

    private async createProfiles() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS profiles (" +
            "id INTEGER PRIMARY KEY," +
            "name TEXT NOT NULL," +
            "edition TEXT NOT NULL," +
            "UNIQUE(name));", []);
    }

    private async createSynchronizations2() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS synchronizations (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "entity TEXT NOT NULL," +
            "edition TEXT NOT NULL);", []).then(async () => {
                return this.database.executeSql("SELECT COUNT(0) size FROM synchronizations;", []).then(e => {
                    if (e.rows.item(0).size === 0) {
                        return this.database.executeSql("INSERT INTO synchronizations(entity, edition)" +
                            "VALUES ('OPTIONS', '2000-01-01 00:00:00')," +
                            "('PROFILES', '2000-01-01 00:00:00');", []);
                    }
                });
            });
    }

    private isReady() {
        return new Promise((resolve) => {
            if (this.dbReady.getValue()) resolve();
            else this.dbReady.subscribe((ready) => { if (ready) resolve() });
        })
    }

    public async syncUp2(callback: any) {
        this.isReady().then(() => this.select2("SELECT * FROM synchronizations;").then(syns => {
            let synchronization: Entities.Synchronization = new Entities.Synchronization();
            syns.forEach(s => { if (s.entity === "OPTIONS") this.sync(s.entity, "2018-04-03 00:00:00").then(i => { synchronization.options = i; callback(synchronization) }) });
        }));
    }

    private async sync(entity: string, edition: string) {
        return this.isReady().then(async () => {
            let synchronization: Entities.SynchronizationBatch = new Entities.SynchronizationBatch();
            synchronization.edition = edition;
            return this.select2(`SELECT * FROM ${entity};`).then(e => {
                e.forEach(d => {
                    synchronization.existings.push(d.id);
                    if (new Date(d.edition) > new Date(edition)) synchronization.synchronizations.push(d);
                });
                return synchronization;
            });
        });
    }

    public async syncOptions(synchronization: Entities.SynchronizationBatch) {
        return this.isReady().then(async () => {
            this.database.executeSql(`UPDATE synchronizations SET edition='${synchronization.edition}' WHERE entity='OPTIONS';`, []);
            return this.database.executeSql(`DELETE FROM options WHERE id NOT IN(${synchronization.existings});`, []).then(() => {
                return this.select2("SELECT id FROM options").then(d => {
                    let ids = d.map(i => i.id);
                    let values = [];
                    synchronization.synchronizations.forEach(s => {
                        if (ids.includes(s.id)) {
                            this.database.executeSql(`UPDATE options SET action='${s.action}', module='${s.module}', edition='${s.edition}' WHERE id=${s.id};`, []);
                        } else { values.push(`(${s.id}, '${s.action}', '${s.module}', '${s.edition}')`); }
                    });
                    if (values.length > 0) {
                        this.database.executeSql(`INSERT INTO options (id, action, module, edition) VALUES ${values.map(v => v)};`, []);
                    }
                });
            });
        });
    }

    private async select2(query: string) {
        return this.database.executeSql(query, []).then((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) lists.push(data.rows.item(i));
            return lists;
        });
    }

    public async optionsFindAll() { return this.isReady().then(() => this.select2("SELECT * FROM options;")); }


    public async profilesFindAll() { return this.isReady().then(() => this.select2("SELECT * FROM synchronizations;")); }
}