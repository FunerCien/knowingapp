import { ToastController, ModalController } from '@ionic/angular';
import { formatDate, DatePipe } from '@angular/common';

export class Util {
    static createToast(message: String, toast: ToastController) {
        return toast.create({
            closeButtonText: "Ok",
            duration: 3000,
            message: message.toString(),
            position: 'bottom',
            showCloseButton: true
        });
    }
    static now(): String { return new DatePipe("en-US").transform(new Date(), "yyyy-MM-dd hh:mm:ss").toString(); }
    static search(list: Array<any>, value: String): Array<any> { return list.filter(o => o.toString().toLowerCase().includes(value.toLowerCase())); }
}