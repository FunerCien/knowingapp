import { DatePipe } from '@angular/common';

export class Util {
    private static LOADING: HTMLIonLoadingElement;
    private static NETWORK_STATUS: string = "NS";
    private static TOAST: any;
    public static setLoading(loading: HTMLIonLoadingElement, toast: any) {
        this.LOADING = loading;
        this.TOAST = toast;
    }
    public static dismissServerError(message: string, severity: string) {
        let color: string;
        if (severity == "INFORMATION") color = "light";
        else if (severity == "WARNING") color = "warning";
        else color = "danger";
        this.LOADING.dismiss();
        this.TOAST(message, color);
    }
    public static URL: string = "http://knowingserver.herokuapp.com";
    public static getNetworkStatus(): Boolean { return localStorage.getItem(this.NETWORK_STATUS) === "Y" }
    public static getDate(date?: Date): string { return new DatePipe("en-US").transform(date ? date : new Date(), "yyyy-MM-dd HH:mm:ss"); }
    public static search(list: Array<any>, value: string): Array<any> { return list.filter(l => l.toString().toLowerCase().includes(value.toLowerCase())); }
    public static setNetworkStatus(status: Boolean) { localStorage.setItem(this.NETWORK_STATUS, status ? "Y" : "N") }
}