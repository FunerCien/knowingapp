import { map } from "rxjs/operators";
import { forkJoin, from, Observable, Observer } from 'rxjs';
import { Entities } from '../entities/Entities';
import { Injectable } from '@angular/core';
import { SQL, Table } from './db.sql';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SynchroizationService } from './synchronization.service';
import { Util } from '../components/utilities/utility';

@Injectable()
export class DatabaseService {
    private database: SQLiteObject;
    constructor(private sql: SQLite, private service: SynchroizationService) { }
    private completeObserver(observer: Observer<any>, value: any) {
        observer.next(value);
        observer.complete();
    }
    private insertSynchronizations(): Observable<any> {
        return Observable.create((o: Observer<Entities.SynchronizationBatch>) => {
            this.select(SQL.ALL(Table.synchronizations)).subscribe(syncs => {
                let tables: string[] = new Array();
                for (let table in Table) {
                    let exist: Boolean = false;
                    syncs.forEach((s: any) => { if (s.entity == table) exist = true; });
                    if (!exist) tables.push(table);
                }
                if (tables.length == 0) this.completeObserver(o, []);
                else this.runSQL(SQL.INSERT_SYNCHRONIZATION(tables)).subscribe(() => this.completeObserver(o, []));
            })
        });
    }
    private runSQL(sql: string): Observable<any> { return from(this.database.executeSql(sql, [])) }
    private persist(entities: any[], insert: any, update: any, validation: any): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            let values: any[] = new Array();
            entities.forEach(e => {
                if (validation(e)) this.runSQL(update(e));
                else values.push(e);
            });
            if (values.length != 0) this.runSQL(insert(values)).subscribe(() => this.completeObserver(o, []));
            else this.completeObserver(o, []);
        })
    }
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
                    if (r.id) batch.existings.push(r.id);
                    if (new Date(r.edition) > new Date(edition)) batch.synchronizations.push(r);
                });
                this.completeObserver(o, batch);
            });
        });
    }
    private sync(synchronization: Entities.SynchronizationBatch, table: Table): Observable<any> {
        switch (table) {
            case Table.options: return this.syncSpecific(synchronization, table, (o: Entities.Option[]) => SQL.INSERT_OPTIONS(o), (o: Entities.Option) => SQL.UPDATE_OPTIONS(o));
            case Table.profiles: return this.syncSpecific(synchronization, table, (o: Entities.Profile[]) => SQL.INSERT_PROFILES(o), (o: Entities.Profile) => SQL.UPDATE_PROFILES(o));
        }
    }
    private syncSpecific(batch: Entities.SynchronizationBatch, table: Table, insert: any, update: any): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            forkJoin(this.runSQL(SQL.UPDATE_SYNCHRONIZATION(batch.edition, table)), this.runSQL(SQL.DELETE_ID_NOT_IN(batch.existings, table))).subscribe(() => {
                this.select(SQL.IDS(table)).subscribe(r => {
                    let ids = r.map(i => i.id);
                    this.persist(batch.synchronizations, insert, update, (e: any) => ids.includes(e.id)).subscribe(() => this.completeObserver(o, []));
                });
            });
        });
    }
    public delete(table: Table, lid: Number): Observable<any> { return this.runSQL(SQL.DELETE(lid, table)) }
    public dropDB(): Observable<any> { return from(this.sql.deleteDatabase({ name: SQL.DATABASE, iosDatabaseLocation: SQL.LOCATION })); }
    public exist(table: Table, entity: any): Observable<Boolean> {
        return Observable.create((o: Observer<Boolean>) => {
            switch (table) {
                case Table.profiles: this.select(SQL.EXIST_PROFILE(entity)).subscribe(d => this.completeObserver(o, d[0].exist > 0));
            }
        });
    }
    public openDb(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            from(this.sql.create({ location: SQL.LOCATION, name: SQL.DATABASE })).subscribe(d => {
                this.database = d;
                forkJoin(
                    this.runSQL(SQL.CREATE_OPTIONS),
                    this.runSQL(SQL.CREATE_PROFILES),
                    this.runSQL(SQL.CREATE_SYNCHRONIZATIONS)
                ).subscribe(() => this.insertSynchronizations().subscribe(() => this.completeObserver(o, [])));
            });
        });
    }
    public save(table: Table, entities: any[]): Observable<any> {
        switch (table) {
            case Table.profiles: return this.persist(entities, (o: Entities.Profile[]) => SQL.INSERT_PROFILES(o), (o: Entities.Profile) => SQL.UPDATE_PROFILES_LOCAL(o), (e: any) => e.lid);
        }
    }
    public selectAll(table: Table): Observable<any[]> {
        return Observable.create(async (o: Observer<any[]>) => {
            if (Util.getNetworkStatus()) {
                this.select(SQL.ALL(Table.synchronizations)).subscribe(sync => {
                    let data = sync.filter(s => s.entity == table)[0];
                    this.selectSynchronizable(data.entity, data.edition).subscribe(f => this.service.syncSpecific(table, f).subscribe(s => this.sync(s, table).subscribe(() => this.select(SQL.ALL(table)).subscribe(data => this.completeObserver(o, data)))));
                });
            } else this.select(SQL.ALL(table)).subscribe(data => this.completeObserver(o, data));
        });
    }
    public syncAll(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            this.select(SQL.ALL(Table.synchronizations)).subscribe(sync => {
                let options = sync.filter(s => s.entity == Table.options)[0];
                let profiles = sync.filter(s => s.entity == Table.profiles)[0];
                forkJoin(
                    this.selectSynchronizable(options.entity, options.edition),
                    this.selectSynchronizable(profiles.entity, profiles.edition)
                ).subscribe(f => {
                    let synchronization: Entities.Synchronization = new Entities.Synchronization();
                    synchronization.options = f[0];
                    synchronization.profiles = f[1];
                    this.service.syncAll(synchronization).subscribe((d => forkJoin(
                        this.sync(d.options, Table.options),
                        this.sync(d.profiles, Table.profiles)
                    ).subscribe(() => this.completeObserver(o, []))));
                });
            });
        });
    }
}