import {Injectable} from '@angular/core';
import {AlertController, Events, Platform} from 'ionic-angular';
import {Network} from '@ionic-native/network';
import {ToastController} from 'ionic-angular';

export enum ConnectionStatusEnum {
    Online,
    Offline
}

// TODO Broadcast network state events globally
@Injectable()
export class NetworkProvider {

    previousStatus;

    constructor(public alertCtrl: AlertController,
                public network: Network,
                public eventCtrl: Events,
                public toast: ToastController) {

         
        this.previousStatus = ConnectionStatusEnum.Online;
        // this.initializeNetworkEvents();
    }

    //TODO publish events
    public initializeNetworkEvents(): void {
        this.network.onConnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Offline && (this.network.type == '4g' || this.network.type == 'wifi')) {
                this.eventCtrl.publish('ONLINE');
                 
                this.toast.create({
                    message: '已联网(状态:' + this.network.type + ')',
                    duration: 2000
                }).present();
                this.previousStatus = ConnectionStatusEnum.Online;
            }
        });
        this.network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
                this.eventCtrl.publish('OFFLINE');
                 
                this.toast.create({
                    message: '进入无网状态',
                    duration: 2000
                }).present();
                this.previousStatus = ConnectionStatusEnum.Offline;
            }
        });
        this.network.onchange().subscribe(() => {
             
        });
    }

}
