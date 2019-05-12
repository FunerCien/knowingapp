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
    private complete(message: string, observer: Observer<any>, loading?: HTMLIonLoadingElement) {
        if (loading) loading.dismiss();
        this.message.presentToast(message);
        observer.next([]);
        observer.complete();
    }
    public delete(profile: Entities.Profile): Observable<any> {
        return Observable.create(async (o: Observer<any>) => {
            let loading = await this.message.createLoading("Eliminando");
            let message = `${profile} eliminado`;
            loading.present();
            if (Util.getNetworkStatus()) return this.http.get<Number>(`${this.url}/delete/${profile.id}`, { headers: this.httpHeaders }).subscribe(() => this.complete(message, o, loading));
            else this.db.delete(Table.profiles, profile.lid).subscribe(() => this.complete(message, o, loading));
        })
    }
    public getAll(): Observable<Entities.Profile[]> { return this.db.selectAll(Table.profiles); }
    public save(profile: Entities.Profile): Observable<Entities.Profile> {
        return Observable.create((o: Observer<Entities.Profile>) => {
            profile.name = profile.name.trim();
            this.db.exist(Table.profiles, profile).subscribe(async e => {
                if (!e) {
                    let loading = await this.message.createLoading("Guardando");
                    let message: string = `${profile} guardado`;
                    loading.present();
                    if (Util.getNetworkStatus()) this.db.prepareSynchronization(profile, Table.profiles).subscribe(p => this.http.post<Entities.Profile>(`${this.url}/save`, p, { headers: this.httpHeaders }).subscribe(() => this.complete(message, o, loading)));
                    else this.db.save(Table.profiles, [profile]).subscribe(() => this.complete(message, o, loading));
                } else {
                    let message: string = `Ya existe el perfil ${profile}`
                    o.error(message);
                    this.message.presentToast(message);
                }
            });
        });
    }
}
