import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Entities } from 'src/app/entities/Entities';
import { Observable, Observer, forkJoin } from 'rxjs';
import { Util } from 'src/app/components/utilities/utility';
import { DatabaseService } from 'src/app/services/db.service';
import { Table } from 'src/app/services/db.sql';
import { Message } from 'src/app/components/utilities/message';
import { IMap } from 'src/app/components/utilities/IMap';

@Injectable()
export class ProfileService {
    private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    private url: string = Util.URL + "/profile";
    private urlCoordination: string = Util.URL + "/coordination";
    constructor(private db: DatabaseService, private message: Message, private http: HttpClient) { }
    private complete(observer: Observer<any>, value: any, message?: string, loading?: HTMLIonLoadingElement) {
        if (message) this.message.presentToast(message);
        if (loading) loading.dismiss();
        observer.next(value);
        observer.complete();
    }
    public delete(profile: Entities.Profile): Observable<any> {
        return Observable.create(async (o: Observer<any>) => {
            let loading = await this.message.createLoading("Eliminando");
            let message = `${profile} eliminado`;
            loading.present();
            if (Util.NETWORK_STATUS) return this.http.get<Number>(`${this.url}/delete/${profile.id}`, { headers: this.httpHeaders }).subscribe(() => this.complete(o, [], message, loading));
            else this.db.delete(Table.profiles, profile.lid).subscribe(() => this.complete(o, [], message, loading));
        });
    }
    public deleteCoordination(coordination: Entities.Coordination): Observable<any> {
        return Observable.create(async (o: Observer<any>) => {
            if (Util.NETWORK_STATUS) return this.http.get<Number>(`${this.urlCoordination}/delete/${coordination.id}`, { headers: this.httpHeaders }).subscribe(() => this.complete(o, []));
            else this.db.delete(Table.coordinations, coordination.lid).subscribe(() => this.complete(o, []));
        });
    }
    public getAll(): Observable<Entities.Profile[]> {
        return Observable.create((o: Observer<Entities.Profile[]>) => this.db.selectAll(Table.profiles).subscribe(profiles => {
            this.db.selectAll(Table.coordinations).subscribe(coordinations => {
                let profilesMap: IMap = {};
                profiles.forEach(pro => profilesMap[pro.lid] = new Entities.Profile(pro));
                this.complete(o, Util.sort(profiles.map(pro => {
                    pro = new Entities.Profile(pro);
                    coordinations.forEach(co => {
                        if (co.lcoordinated == pro.lid) {
                            let coordination: Entities.Coordination = new Entities.Coordination(co);
                            coordination.coordinated = pro;
                            coordination.coordinator = profilesMap[co.lcoordinator.toString()];
                            pro.coordinators.push(coordination);
                        } else if (co.lcoordinator == pro.lid) {
                            let coordination: Entities.Coordination = new Entities.Coordination(co);
                            coordination.coordinator = pro;
                            coordination.coordinated = profilesMap[co.lcoordinated.toString()];
                            pro.coordinated.push(coordination);
                        }
                    });
                    return pro;
                })));
            });
        }));
    }
    public save(profile: Entities.Profile): Observable<Entities.Profile> {
        return Observable.create((o: Observer<Entities.Profile>) => {
            this.db.exist(Table.profiles, profile).subscribe(async e => {
                if (!e) {
                    let loading = await this.message.createLoading("Guardando");
                    let message: string = `${profile} guardado`;
                    loading.present();
                    if (Util.NETWORK_STATUS) this.db.prepareSynchronization(profile, Table.profiles).subscribe(p => this.http.post<Entities.Profile>(`${this.url}/save`, p, { headers: this.httpHeaders }).subscribe(() => this.complete(o, [], message, loading)));
                    else this.db.save(Table.profiles, [profile]).subscribe(() => this.complete(o, [], message, loading));
                } else {
                    let message: string = `Ya existe el perfil ${profile}`
                    o.error(message);
                    this.message.presentToast(message);
                }
            });
        });
    }
    public saveCoordination(coordination: Entities.Coordination): Observable<Entities.Coordination> {
        return Observable.create((o: Observer<Entities.Coordination>) => {
            this.db.exist(Table.coordinations, coordination).subscribe(async e => {
                if (!e) {
                    coordination.coordinated.coordinated = [];
                    coordination.coordinated.coordinators = [];
                    coordination.coordinator.coordinated = [];
                    coordination.coordinator.coordinators = [];
                    if (Util.NETWORK_STATUS) this.db.prepareSynchronization(coordination, Table.coordinations).subscribe(coo => this.http.post<Entities.Coordination>(`${this.urlCoordination}/save`, coo, { headers: this.httpHeaders }).subscribe(c => this.complete(o, new Entities.Coordination(c))));
                    else this.db.save(Table.coordinations, [coordination]).subscribe(() => this.complete(o, coordination));
                } else {
                    let message: string = `La coordinación ya esta asignada`;
                    o.error(message);
                    this.message.presentToast(message);
                }
            });
        });
    }
}
