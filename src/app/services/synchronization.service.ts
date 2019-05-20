import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entities } from 'src/app/entities/Entities';
import { Observable } from 'rxjs';
import { Table } from './db.sql';
import { Util } from '../components/utilities/utility';

@Injectable()
export class SynchroizationService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    private url: string = Util.URL + "/synchronization";
    constructor(private http: HttpClient) { }
    public syncAll(synchronization: Entities.Synchronization): Observable<Entities.Synchronization> { return this.http.post<Entities.Synchronization>(`${this.url}/all`, synchronization, { headers: this.httpHeaders }) }
    public syncSpecific(table: Table, batch: Entities.SynchronizationBatch): Observable<Entities.SynchronizationBatch> { return this.http.post<Entities.SynchronizationBatch>(`${this.url}/${table}`, batch, { headers: this.httpHeaders }) }
    public verifyVersion(): Observable<String> { return this.http.get<String>(`${this.url}/version/${Util.VERSION}`, { headers: this.httpHeaders }) }
}
