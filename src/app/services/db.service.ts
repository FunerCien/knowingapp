import { concatMap, map } from "rxjs/operators";
import { forkJoin, from, Observable, Observer } from 'rxjs';
import { Entities } from '../entities/Entities';
import { Injectable } from '@angular/core';
import { Message } from '../components/utilities/message';
import { SQL, Table } from './db.sql';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SynchroizationService } from './synchronization.service';
import { Util } from '../components/utilities/utility';

@Injectable()
export class DatabaseService {
    private database: SQLiteObject;
    constructor(private message: Message, private sql: SQLite, private service: SynchroizationService) { }
    private completeObserver(observer: Observer<any>, value: any) {
        observer.next(value);
        observer.complete();
    }
    private createOptions(): Observable<any> { return this.runSQL(SQL.CREATE_OPTIONS); }
    private createSynchronizations(): Observable<any> { return this.runSQL(SQL.CREATE_SYNCHRONIZATIONS); }
    private insertSynchronizations(): Observable<any> {
        return this.isEmpty(Table.synchronizations).pipe(concatMap(e => {
            if (e) return this.runSQL(SQL.INSERT_SYNCHRONIZATION([Table.options]));
            else return [];
        }));
    }
    private isEmpty(table: Table): Observable<Boolean> { return from(this.select(SQL.COUNT(table))).pipe(map(e => !!e[0].empty)); }
    private runSQL(sql: string): Observable<any> { return from(this.database.executeSql(sql, [])) }
    private select(query: string): Observable<any[]> {
        return this.runSQL(query).pipe(map((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) lists.push(data.rows.item(i));
            return lists;
        }));
    }
    private selectSynchronizable(table: Table, edition: string): Observable<Entities.SynchronizationBatch> {
        return Observable.create((o: Observer<Entities.SynchronizationBatch>) => {
            this.select(SQL.ALL(table)).subscribe(row => {
                let batch: Entities.SynchronizationBatch = new Entities.SynchronizationBatch();
                batch.edition = edition;
                row.forEach(r => {
                    batch.existings.push(r.id)
                    if (new Date(r.edition) > new Date(edition)) batch.synchronizations.push(r);
                });
                this.completeObserver(o, batch);
            });
        });
    }
    private syncOptions(synchronization: Entities.SynchronizationBatch): Observable<any> { return this.syncSpecific(synchronization, Table.options, (o: Entities.Option[]) => SQL.INSERT_OPTIONS(o), (o: Entities.Option) => SQL.UPDATE_OPTIONS(o)); }
    private syncSpecific(batch: Entities.SynchronizationBatch, table: Table, insert: any, update: any): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            forkJoin(this.runSQL(SQL.UPDATE_SYNCHRONIZATION(batch.edition, table)), this.runSQL(SQL.DELETE_ID_NOT_IN(batch.existings, table))).subscribe(() => {
                this.select(SQL.IDS(table)).subscribe(r => {
                    let ids = r.map(i => i.id);
                    let inserts: any[] = new Array();
                    batch.synchronizations.forEach(s => {
                        if (ids.includes(s.id)) this.runSQL(update(s));
                        else inserts.push(s);
                    });
                    if (inserts.length != 0) this.runSQL(insert(inserts)).subscribe(() => this.completeObserver(o, []));
                    else this.completeObserver(o, []);
                });
            });
        });
    }
    public dropDB(): Observable<any> { return from(this.sql.deleteDatabase({ name: SQL.DATABASE, iosDatabaseLocation: SQL.LOCATION })); }
    public openDb(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            from(this.sql.create({ location: SQL.LOCATION, name: SQL.DATABASE })).subscribe(d => {
                this.database = d;
                forkJoin(this.createOptions(), this.createSynchronizations()).subscribe(() => this.insertSynchronizations().subscribe(() => this.completeObserver(o, [])));
            });
        });
    }
    public async selectAll(table: Table, callback: any) {
        if (Util.getNetworkStatus()) {
            let loading = await this.message.createLoading();
            loading.onDidDismiss().then(() => this.select(SQL.ALL(Table.options)).subscribe(data => callback(data)));
            loading.present();
            this.select(SQL.ALL(Table.synchronizations)).subscribe(sync => {
                let options = sync.filter(s => s.entity == table)[0];
                this.selectSynchronizable(options.entity, options.edition).subscribe(f => {
                    this.service.syncSpecific(table, f[0]).subscribe((s => this.syncOptions(s).subscribe(() => loading.dismiss())));
                });
            });
        } else { this.select(SQL.ALL(Table.options)).subscribe(data => callback(data)); }
    }
    public syncAll(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            this.select(SQL.ALL(Table.synchronizations)).subscribe(sync => {
                let options = sync.filter(s => s.entity == Table.options)[0];
                forkJoin(this.selectSynchronizable(options.entity, options.edition)).subscribe(f => {
                    let synchronization: Entities.Synchronization = new Entities.Synchronization();
                    synchronization.options = f[0];
                    this.service.syncAll(synchronization).subscribe((d => this.syncOptions(d.options).subscribe(() => this.completeObserver(o, []))));
                });
            });
        });
    }
}