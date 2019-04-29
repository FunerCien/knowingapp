import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Util } from './utility';

@Injectable()
export class Message {
    constructor(private loading: LoadingController, private toast: ToastController) { }
    public async createLoading(message?: string) {
        let load = await this.loading.create({
            animated: true,
            keyboardClose: true,
            message: message,
            mode: 'ios',
            showBackdrop: true,
            spinner: 'dots',
            translucent: true
        });
        Util.setLoading(load, ((m: string) => this.presentToast(m)));
        return load;
    }
    public async presentToast(message: string) {
        let toast = await this.toast.create({
            animated: true,
            closeButtonText: "Ok",
            color: 'light',
            duration: 3000,
            keyboardClose: true,
            message: message,
            mode: 'ios',
            position: 'bottom',
            showCloseButton: true,
            translucent: true
        });
        toast.present();
    }
}
