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
                else SQL.INSERT_SYNCHRONIZATION(tables).subscribe(i => this.runSQL(i).subscribe(() => this.completeObserver(o, [])));
            })
        });
    }
    private persist(entities: any[], insert: any, update: any, validation: any): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            let values: any[] = new Array();
            entities.forEach(en => {
                if (validation(en)) update(en).subscribe((e: string) => this.runSQL(e));
                else values.push(en);
            });
            if (values.length != 0) insert(values).subscribe((v: string) => this.runSQL(v).subscribe(() => this.completeObserver(o, [])));
            else this.completeObserver(o, []);
        })
    }
    private runSQL(sql: string): Observable<any> { return from(this.database.executeSql(sql, [])) }
    private select(query: string): Observable<any[]> {
        return this.runSQL(query).pipe(map(d => {
            let list = [];
            for (let i = 0; i < d.rows.length; i++) list.push(d.rows.item(i));
            return list;
        }));
    }
    private selectSynchronizable(table: Table, edition: string, ledition: string): Observable<Entities.SynchronizationBatch> {
        return Observable.create((o: Observer<Entities.SynchronizationBatch>) => {
            this.select(SQL.ALL(table)).subscribe(row => {
                let batch: Entities.SynchronizationBatch = new Entities.SynchronizationBatch();
                batch.edition = edition;
                let synchronizables = new Array();
                row.forEach(r => {
                    if (r.id) batch.existings.push(r.id);
                    if (new Date(r.edition) > new Date(ledition)) synchronizables.push(this.prepareSynchronization(r, table));
                });
                if (synchronizables.length > 0) forkJoin(synchronizables).subscribe(sync => {
                    sync.forEach(s => batch.synchronizations.push(s));
                    this.completeObserver(o, batch);
                });
                else this.completeObserver(o, batch);
            });
        });
    }
    private sync(synchronization: Entities.SynchronizationBatch, table: Table): Observable<any> {
        switch (table) {
            case Table.coordinations: return this.syncSpecific(synchronization, table, (s: Entities.Coordination[]) => Observable.create((o: Observer<string>) => SQL.INSERT_COORDINATIONS(s, this.select(SQL.ALL(Table.profiles))).subscribe(d => this.completeObserver(o, d))), (s: Entities.Coordination) => Observable.create((o: Observer<string>) => SQL.UPDATE_COORDINATIONS(s).subscribe(d => this.completeObserver(o, d))));
            case Table.options: return this.syncSpecific(synchronization, table, (s: Entities.Option[]) => Observable.create((o: Observer<string>) => SQL.INSERT_OPTIONS(s).subscribe(d => this.completeObserver(o, d))), (s: Entities.Option) => Observable.create((o: Observer<string>) => SQL.UPDATE_OPTIONS(s).subscribe(d => this.completeObserver(o, d))));
            case Table.profiles: return this.syncSpecific(synchronization, table, (s: Entities.Profile[]) => Observable.create((o: Observer<string>) => SQL.INSERT_PROFILES(s).subscribe(d => this.completeObserver(o, d))), (s: Entities.Profile) => Observable.create((o: Observer<string>) => SQL.UPDATE_PROFILES(s).subscribe(d => this.completeObserver(o, d))));
        }
    }
    private syncSpecific(batch: Entities.SynchronizationBatch, table: Table, insert: any, update: any): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            SQL.UPDATE_SYNCHRONIZATION(batch.edition, table).subscribe(u => {
                forkJoin(this.runSQL(u), this.runSQL(SQL.DELETE_ID_NOT_IN(batch.existings, table))).subscribe(() => {
                    this.select(SQL.IDS(table)).subscribe(r => {
                        let ids = r.map(i => i.id);
                        this.persist(batch.synchronizations, insert, update, (e: any) => ids.includes(e.id)).subscribe(() => this.completeObserver(o, []));
                    });
                });
            });
        });
    }
    public delete(table: Table, lid: Number): Observable<any> { return this.runSQL(SQL.DELETE(lid, table)) }
    public dropDB(): Observable<any> { return from(this.sql.deleteDatabase({ name: SQL.DATABASE, iosDatabaseLocation: SQL.LOCATION })); }
    public exist(table: Table, entity: any): Observable<Boolean> {
        return Observable.create((o: Observer<Boolean>) => {
            switch (table) {
                case Table.coordinations: this.select(SQL.EXIST_COORDINATION(entity)).subscribe(d => this.completeObserver(o, d[0].exist > 0));
                case Table.profiles: this.select(SQL.EXIST_PROFILE(entity)).subscribe(d => this.completeObserver(o, d[0].exist > 0));
            }
        });
    }
    public prepareSynchronization(entity: any, table: Table): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            this.select(SQL.ALL(Table.synchronizations)).subscribe(sync => {
                let data = sync.filter(s => s.entity == table)[0];
                let date = new Date();
                date.setTime(new Date(data.edition).getTime() + (new Date(entity.edition).getTime() - new Date(data.ledition).getTime()));
                entity.edition = Util.getDate(date);
                this.completeObserver(o, entity);
            });
        });
    }
    public openDb(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            from(this.sql.create({ location: SQL.LOCATION, name: SQL.DATABASE })).subscribe(d => {
                this.database = d;
                forkJoin(
                    this.runSQL(SQL.CREATE_COORDINATIONS),
                    this.runSQL(SQL.CREATE_OPTIONS),
                    this.runSQL(SQL.CREATE_PROFILES),
                    this.runSQL(SQL.CREATE_SYNCHRONIZATIONS)
                ).subscribe(() => this.insertSynchronizations().subscribe(() => this.completeObserver(o, [])));
            });
        });
    }
    public save(table: Table, entities: any[]): Observable<any> {
        switch (table) {
            case Table.coordinations: return this.persist(entities, (o: Entities.Coordination[]) => SQL.INSERT_COORDINATIONS(o, this.select(SQL.ALL(Table.profiles))), (o: Entities.Coordination) => SQL.UPDATE_COORDINATIONS_LOCAL(o), (e: any) => e.lid);
            case Table.profiles: return this.persist(entities, (o: Entities.Profile[]) => SQL.INSERT_PROFILES(o), (o: Entities.Profile) => SQL.UPDATE_PROFILES_LOCAL(o), (e: any) => e.lid);
        }
    }
    public selectAll(table: Table): Observable<any[]> {
        return Observable.create(async (o: Observer<any[]>) => {
            if (Util.NETWORK_STATUS) {
                this.select(SQL.ALL(Table.synchronizations)).subscribe(sync => {
                    let data = sync.filter(s => s.entity == table)[0];
                    this.selectSynchronizable(data.entity, data.edition, data.ledition).subscribe(f => this.service.syncSpecific(table, f).subscribe(s => this.sync(s, table).subscribe(() => this.select(SQL.ALL(table)).subscribe(data => this.completeObserver(o, data)))));
                });
            } else this.select(SQL.ALL(table)).subscribe(data => this.completeObserver(o, data));
        });
    }
    public syncAll(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            this.select(SQL.ALL(Table.synchronizations)).subscribe(sync => {
                let coordinations = sync.filter(s => s.entity == Table.coordinations)[0];
                let options = sync.filter(s => s.entity == Table.options)[0];
                let profiles = sync.filter(s => s.entity == Table.profiles)[0];
                forkJoin(
                    this.selectSynchronizable(coordinations.entity, coordinations.edition, coordinations.ledition),
                    this.selectSynchronizable(options.entity, options.edition, options.ledition),
                    this.selectSynchronizable(profiles.entity, options.edition, profiles.ledition)
                ).subscribe(f => {
                    let synchronization: Entities.Synchronization = new Entities.Synchronization();
                    synchronization.coordinations = f[0];
                    synchronization.options = f[1];
                    synchronization.profiles = f[2];
                    this.service.syncAll(synchronization).subscribe((s => {
                        forkJoin(
                            this.sync(s.options, Table.options),
                            this.sync(s.profiles, Table.profiles)
                        ).subscribe(() => this.sync(s.coordinations, Table.coordinations).subscribe(() => this.completeObserver(o, [])))
                    }));
                });
            });
        });
    }
}