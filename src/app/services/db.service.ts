import { Observable, forkJoin, from, Observer } from 'rxjs';
import { map, concatMap } from "rxjs/operators";
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Entities } from '../entities/Entities';
import { SynchroizationService } from './synchronization.service';
import { SQL } from './db.sql';

@Injectable()
export class DatabaseService {
    private database: SQLiteObject;
    private tables = ["options"];
    constructor(private sql: SQLite, private service: SynchroizationService) { }
    private completeObserver(observer: Observer<any>, value: any) {
        observer.next(value);
        observer.complete();
    }
    private createOptions(): Observable<any> { return this.runSQL(SQL.CREATE_OPTIONS); }
    private createSynchronizations(): Observable<any> { return this.runSQL(SQL.CREATE_SYNCHRONIZATIONS); }
    private insertSynchronizations(): Observable<any> {
        return this.isEmpty("synchronizations").pipe(concatMap(e => {
            if (e) return this.runSQL(SQL.INSERT_SYNCHRONIZATION(this.tables));
            else return [];
        }));
    }
    private isEmpty(table: string): Observable<Boolean> {
        return from(this.select(SQL.COUNT(table))).pipe(map(e => !!e[0].empty));
    }
    private runSQL(sql: string): Observable<any> { return from(this.database.executeSql(sql, [])) }
    private select(query: string): Observable<any[]> {
        return this.runSQL(query).pipe(map((data) => {
            let lists = [];
            for (let i = 0; i < data.rows.length; i++) lists.push(data.rows.item(i));
            return lists;
        }));
    }
    private selectSynchronizable(table: string, edition: string): Observable<Entities.SynchronizationBatch> {
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
    private syncOptions(synchronization: Entities.SynchronizationBatch): Observable<any> { return this.syncSpecific(synchronization, "options", (o: Entities.Option[]) => SQL.INSERT_OPTIONS(o), (o: Entities.Option) => SQL.UPDATE_OPTIONS(o)); }
    private syncSpecific(batch: Entities.SynchronizationBatch, table: string, insert: any, update: any): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            forkJoin(
                this.runSQL(SQL.UPDATE_SYNCHRONIZATION(batch.edition, table)),
                this.runSQL(SQL.DELETE_ID_NOT_IN(batch.existings, table))
            ).subscribe(() => {
                this.select(SQL.IDS(table)).subscribe(r => {
                    let ids = r.map(i => i.id);
                    let inserts: any[] = new Array();
                    batch.synchronizations.forEach(s => {
                        if (ids.includes(s.id)) {
                            this.runSQL(update(s));
                        } else { inserts.push(s); }
                    });
                    if (inserts.length != 0) this.runSQL(insert(inserts)).subscribe(() => this.completeObserver(o, []));
                    else this.completeObserver(o, []);
                });
            });
        });
    }
    public dropDB(): Observable<any> { return from(this.sql.deleteDatabase({ name: 'knowing.db', iosDatabaseLocation: 'default' })); }
    public openDb(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            from(this.sql.create({
                location: 'default',
                name: 'knowing.db'
            })).subscribe(d => {
                this.database = d;
                forkJoin(this.createOptions(), this.createSynchronizations()).subscribe(() => this.insertSynchronizations().subscribe(() => this.completeObserver(o, [])));
            });
        });
    }
    public selectOptions(): Observable<Entities.Option[]> { return this.select(SQL.ALL("options")) }
    public syncAll(): Observable<any> {
        return Observable.create((o: Observer<any>) => {
            this.select(SQL.ALL("synchronizations")).subscribe(sync => {
                let options = sync.filter(s => s.entity == "options")[0];
                forkJoin(this.selectSynchronizable(options.entity, options.edition)).subscribe(f => {
                    let synchronization: Entities.Synchronization = new Entities.Synchronization();
                    synchronization.options = f[0];
                    this.service.syncUp(synchronization).subscribe((d => this.syncOptions(d.options).subscribe(() => this.completeObserver(o, []))));
                });
            });
        });
    }
}