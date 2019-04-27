import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular';

@Injectable()
export class Message {
    constructor(private load: LoadingController, private toast: ToastController) { }
    public async createLoading(message: string) {
        return await this.load.create({
            message: message,
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
    }
    public async presentToast(message: string) {
        let toast = await this.toast.create({
            closeButtonText: "Ok",
            duration: 3000,
            message: message,
            position: 'bottom',
            showCloseButton: true
        });
        toast.present();
    }
}
