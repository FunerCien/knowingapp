import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entities } from 'src/app/entities/Entities';
import { Observable } from 'rxjs';
import { Util } from '../components/utilities/utility';

@Injectable()
export class SynchroizationService {
    private httpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    private url: string = Util.URL + "/synchronization";
    constructor(private http: HttpClient) { }
    public syncUp(synchronization: Entities.Synchronization): Observable<Entities.Synchronization> { return this.http.post<Entities.Synchronization>(`${this.url}/all`, synchronization, { headers: this.httpHeaders }); }
}
