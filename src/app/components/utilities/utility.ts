import { DatePipe } from '@angular/common';

export class Util {
    private static NETWORK_STATUS: string = "NS";
    private static LOADING: HTMLIonLoadingElement;
    private static TOAST: any;
    public static setLoading(loading: HTMLIonLoadingElement, toast: any) {
        this.LOADING = loading;
        this.TOAST = toast;
    }
    public static dismissServerError() {
        this.TOAST("¡Error en el servidor!");
        this.LOADING.dismiss();
    }
    public static URL: string = "http://knowingserver.herokuapp.com";
    public static getNetworkStatus(): Boolean { return localStorage.getItem(this.NETWORK_STATUS) === "Y" }
    public static now(): string { return new DatePipe("en-US").transform(new Date(), "yyyy-MM-dd hh:mm:ss"); }
    public static setNetworkStatus(status: Boolean) { localStorage.setItem(this.NETWORK_STATUS, status ? "Y" : "N") }
    public static search(list: Array<any>, value: String): Array<any> { return list.filter(o => o.toLowerCase().includes(value.toLowerCase())); }
}