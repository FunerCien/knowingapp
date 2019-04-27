import { ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

export class Util {
    private static NETWORK_STATUS: string = "NS";
    static URL: string = "http://knowingserver.herokuapp.com";
    static getNetworkStatus(): Boolean { return localStorage.getItem(this.NETWORK_STATUS) === "Y" }
    static now(): string { return new DatePipe("en-US").transform(new Date(), "yyyy-MM-dd hh:mm:ss"); }
    static setNetworkStatus(status: Boolean) { localStorage.setItem(this.NETWORK_STATUS, status ? "Y" : "N") }
    static search(list: Array<any>, value: String): Array<any> { return list.filter(o => o.toLowerCase().includes(value.toLowerCase())); }
}