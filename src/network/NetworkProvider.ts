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

        console.log('NetworkProvider Provider');

        this.previousStatus = ConnectionStatusEnum.Online;

    }

    //TODO publish events
    public initializeNetworkEvents(): void {
        this.network.onConnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Offline) {
                this.eventCtrl.publish('network:online');
            }
            this.previousStatus = ConnectionStatusEnum.Online;
            console.log('NetWork Connected');
            this.toast.create({
                message: '已联网(状态:' + this.network.type + ')',
                duration: 2000
            }).present()
        });
        this.network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
                this.eventCtrl.publish('network:offline');
            }
            this.previousStatus = ConnectionStatusEnum.Offline;
            console.log('NetWork Disconnected');
            this.toast.create({
                message: '进入无网状态',
                duration: 2000
            }).present()
        });
        this.network.onchange().subscribe(() => {
            console.log('NetWork Status Changed To => ' + this.network.type);
        });
    }

    //TODO To handle network state events when App initialized
    /*initializeApp() {
        this.platform.ready().then(() => {

            this.networkProvider.initializeNetworkEvents();

            // Offline event
            this.events.subscribe('network:offline', () => {
                alert('network:offline ==> ' + this.network.type);
            });

            // Online event
            this.events.subscribe('network:online', () => {
                alert('network:online ==> ' + this.network.type);
            });

        });
    }*/
}
