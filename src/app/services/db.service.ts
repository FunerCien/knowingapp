import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
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
                return this.database.executeSql("SELECT COUNT(0) size FROM synchronizations;", []).then(async e => {
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

    public async syncUp() {
        return this.isReady().then(() => this.select("SELECT * FROM synchronizations;").then(syns => {
            let synchronization: Entities.Synchronization = new Entities.Synchronization();
            syns.forEach(s => { if (s.entity === "OPTIONS") this.sync(s.entity, s.edition).then(i => synchronization.options = i) });
            return synchronization;
        }));
    }

    private async sync(entity: string, edition: string) {
        return this.isReady().then(async () => {
            let synchronization: Entities.SynchronizationBatch = new Entities.SynchronizationBatch();
            return this.select(`SELECT * FROM ${entity};`).then(e => {
                e.forEach(d => {
                    synchronization.existings.push(d.id);
                    if (new Date(d.edition) > new Date(edition)) {
                        synchronization.synchronizations.push(d);
                        if (new Date(d.edition) > new Date(synchronization.edition)) synchronization.edition = d.edition;
                    };
                });
                return synchronization;
            });
        });
    }


    private async select(query: string) {
        return this.database.executeSql(query, []).then((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) lists.push(data.rows.item(i));
            return lists;
        });
    }


    public async optionsFindAll() { return this.isReady().then(() => this.select("SELECT * FROM options;")); }

    public async profilesFindAll() { return this.isReady().then(() => this.select("SELECT * FROM profiles;")); }
}