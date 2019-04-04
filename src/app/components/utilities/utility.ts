import { ToastController } from '@ionic/angular';
import { DatePipe } from '@angular/common';

export class Util {
    static URL: string = "http://knowingserver.herokuapp.com";
    static createToast(message: string, toast: ToastController) {
        return toast.create({
            closeButtonText: "Ok",
            duration: 3000,
            message: message,
            position: 'bottom',
            showCloseButton: true
        });
    }
    static now(): string { return new DatePipe("en-US").transform(new Date(), "yyyy-MM-dd hh:mm:ss"); }
    static search(list: Array<any>, value: String): Array<any> { return list.filter(o => o.toLowerCase().includes(value.toLowerCase())); }
}