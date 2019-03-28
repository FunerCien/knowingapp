import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Table } from '../components/utilities/enums/Tables';
import { Entities } from '../entities/Entities';

@Injectable()
export class DatabaseService {
    private database: SQLiteObject;
    private dbReady = new BehaviorSubject<boolean>(false);

    constructor(private platform: Platform, private sql: SQLite) { }

    public async openDB(): Promise<any> {
        return this.platform.ready().then(() => {
            this.sql.create({ location: 'default', name: 'knowing.db' }).then(async (db: SQLiteObject) => {
                this.database = db;
                return this.createOptions().then(async () => {
                    return this.createProfiles().then(async () => {
                        return this.createSynchronizations().then(() => this.dbReady.next(true));
                    });
                });
            });
        });
    }

    private async createOptions() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS options (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "action TEXT NOT NULL," +
            "module TEXT NOT NULL," +
            "edition TEXT NOT NULL," +
            "UNIQUE(action, module));", []);
    }

    private async createProfiles() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS profiles (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "name TEXT NOT NULL," +
            "edition TEXT NOT NULL," +
            "UNIQUE(name));", []);
    }

    private async createSynchronizations() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS synchronizations (" +
            "id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "entity TEXT NOT NULL," +
            "edition TEXT NOT NULL);", []).then(async () => {
                return this.database.executeSql("SELECT COUNT(0) size FROM synchronizations;", []).then(async (data) => {
                    if (data.rows.item(0).size === 0) {
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

    public async syncUp() {
        return this.isReady().then(() => this.selectAll("synchronizations").then((syncs) => {
            let allSyncs: Entities.Synchronization[] = new Array();
            syncs.forEach(s => this.dataToSyncUp(new Entities.Synchronization(s)).then((d) => allSyncs.push(d)));
            return allSyncs;
        }));
    }

    private async dataToSyncUp(sync: Entities.Synchronization) {
        return this.isReady().then(async () => {
            return this.database.executeSql(`SELECT id FROM ${sync.entity};`, []).then((data) => { for (let i = 0; i < data.rows.length; i++) sync.ids.push(data.rows.item(i).id); }).then(async () => {
                return this.database.executeSql(`SELECT * FROM ${sync.entity} WHERE edition > '${sync.edition}';`, []).then((data) => {
                    for (let i = 0; i < data.rows.length; i++) sync.entities.push(data.rows.item(i));
                    return sync;
                });
            });
        });
    }

    private async selectAll(table: String) {
        return this.database.executeSql(`SELECT * FROM ${table};`, []).then((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) lists.push(data.rows.item(i));
            return lists;
        });
    }


    public async optionsFindAll() { return this.isReady().then(() => this.selectAll("options")); }

    public async profilesFindAll() { return this.isReady().then(() => this.selectAll("profiles")); }
}