import { ActionSheetController, AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ComponentRef } from '@ionic/core';
import { Injectable } from '@angular/core';
import { Util } from './utility';

@Injectable()
export class Message {
    constructor(private actionSheetController: ActionSheetController, private alertController: AlertController, private loading: LoadingController, private modal: ModalController, private toast: ToastController) { }
    public async presentActionSheet(header: string, buttons: { cssClass?: string, icon?: string, role?: string, text: string, handler: any }[]) {
        const actionSheet = await this.actionSheetController.create({
            animated: true,
            backdropDismiss: true,
            buttons: buttons,
            cssClass: "action-sheet",
            header: header,
            keyboardClose: true,
            translucent: false
        });
        actionSheet.present();
    }
    public async presentAlert(header: string, message: string, buttons?: { cssClass?: string, text: string, role?: string, handler: any }[]) {
        let but: { cssClass?: string, text: string, role?: string, handler: any }[] = [{
            text: "Cancelar",
            cssClass: "dark",
            role: "cancel",
            handler: () => null
        }];
        if (buttons) buttons.forEach(b => but.push(b));
        const alert = await this.alertController.create({
            animated: true,
            backdropDismiss: true,
            buttons: buttons ? but : [],
            cssClass: 'alert',
            header: header,
            keyboardClose: true,
            message: message,
            mode: 'ios',
            translucent: false
        });

        await alert.present();
    }
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
        Util.setLoading(load, ((m: string, c: string) => this.presentToast(m, c)));
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
        modal.onDidDismiss().then((data?: any) => { if (data) dismiss(data); else dismiss() });
        return modal;
    }
    public async presentToast(message: string, color?: string) {
        color = !color ? "light" : color;
        let toast = await this.toast.create({
            animated: true,
            closeButtonText: "Ok",
            color: color,
            duration: 3000,
            keyboardClose: true,
            message: message,
            mode: color == "light" ? "ios" : "md",
            position: 'bottom',
            showCloseButton: true,
            translucent: false
        });
        toast.present();
    }
}
