import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable()
export class DatabaseService {
    private database: SQLiteObject;
    private dbReady = new BehaviorSubject<boolean>(false);

    constructor(private platform: Platform, private sql: SQLite) { }

    async createDB(dismissLoading: any): Promise<any> {
        return this.platform.ready().then(() => {
            this.sql.create({ location: 'default', name: 'knowing.db' }).then((db: SQLiteObject) => {
                this.database = db;
                this.createOptions().then(() => this.createProfiles().then(() => {
                    dismissLoading();
                    this.dbReady.next(true);
                }));
            });
        });
    }

    private async createOptions() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS options (" +
            "id_opt INTEGER PRIMARY KEY AUTOINCREMENT," +
            "action_opt TEXT NOT NULL," +
            "module_opt TEXT NOT NULL," +
            "update_opt TEXT NOT NULL," +
            "UNIQUE(action_opt, module_opt));", []);
    }

    private async createProfiles() {
        return this.database.executeSql("CREATE TABLE IF NOT EXISTS profiles (" +
            "id_pro INTEGER PRIMARY KEY AUTOINCREMENT," +
            "name_pro TEXT NOT NULL," +
            "update_pro TEXT NOT NULL," +
            "UNIQUE(name_pro));", []);
    }

    private isReady() {
        return new Promise((resolve) => {
            if (this.dbReady.getValue()) resolve();
            else this.dbReady.subscribe((ready) => { if (ready) resolve() });
        })
    }

    private async selectAll(table: String) {
        return this.database.executeSql(`SELECT * FROM ${table}`, []).then((data) => {
            let lists = [];
            console.log(data);
            for (let i = 0; i < data.rows.length; i++) lists.push(data.rows.item(i));
            return lists;
        });;
    }

    public async optionsFindAll() { return this.isReady().then(() => this.selectAll("options")) }

    public async profilesFindAll() { return this.isReady().then(() => this.selectAll("profiles")) }
}