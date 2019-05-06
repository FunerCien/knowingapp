import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entities } from 'src/app/entities/Entities';
import { Observable, Observer } from 'rxjs';
import { Util } from 'src/app/components/utilities/utility';
import { DatabaseService } from 'src/app/services/db.service';
import { Table } from 'src/app/services/db.sql';
import { Message } from 'src/app/components/utilities/message';

@Injectable()
export class ProfileService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    private url: string = Util.URL + "/profile";
    constructor(private db: DatabaseService, private message: Message, private http: HttpClient) { }
    public getAll(): Observable<Entities.Profile[]> { return this.db.selectAll(Table.profiles); }
    public save(profile: Entities.Profile): Observable<Entities.Profile> {
        return Observable.create(async (o: Observer<Entities.Profile>) => {
            let loading = await this.message.createLoading("Guardando");
            loading.present();
            profile.edition = Util.now();
            if (Util.getNetworkStatus()) this.http.post<Entities.Profile>(`${this.url}/save`, profile, { headers: this.httpHeaders }).subscribe(p => {
                loading.dismiss();
                o.next(new Entities.Profile(p));
                o.complete();
            });
            else { }
        });
    }
}
