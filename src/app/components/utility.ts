import { ToastController, ModalController } from '@ionic/angular';

export class Util {
    static search(list: Array<any>, value: String): Array<any> { return list.filter(o => o.toString().toLowerCase().includes(value.toLowerCase())); }
    static createToast(message: String, toast: ToastController) {
        return toast.create({
            closeButtonText: "Ok",
            duration: 3000,
            message: message.toString(),
            position: 'bottom',
            showCloseButton: true
        });
    }
}