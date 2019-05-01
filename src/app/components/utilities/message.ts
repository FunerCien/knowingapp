import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Util } from './utility';
import { ComponentRef } from '@ionic/core';

@Injectable()
export class Message {
    constructor(private loading: LoadingController, private modal: ModalController, private toast: ToastController) { }
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
    public async presentModal(component: ComponentRef, props: any, dismiss: any) {
        let modal = await this.modal.create({
            animated: true,
            component: component,
            componentProps: props,
            keyboardClose: true,
            mode: "ios",
            showBackdrop: true
        });
        modal.onDidDismiss().then(() => dismiss());
        return modal;
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
