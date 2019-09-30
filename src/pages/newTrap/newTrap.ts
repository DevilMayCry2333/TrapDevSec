import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { NavController } from 'ionic-angular';
import { ScanPage} from '../scan/scan'
@Component({
    selector: 'app-home',
    templateUrl: 'newTrap.html',
})
export class TrapPage {
    deviceId: ''
    deviceSerial: ''
    longtitude: ''
    latitude: ''
    altitude: ''
    accuracy: ''
    newbettle: ''
    otherbettle: ''
    users: any[] = [
        {
            id: 1,
            first: 'Alice',
            last: 'Smith',
        },
        {
            id: 2,
            first: 'Bob',
            last: 'Davis',
        },
        {
            id: 3,
            first: 'Charlie',
            last: 'Rosenburg',
        }
    ];

    constructor(public navCtrl: NavController, public qrScanner: QRScanner) { }

    trapClick() {
        console.log("trap");
    }

    scan() {
        console.log("scan");
        this.navCtrl.push(ScanPage);
    }
    deviceIdInput() {
        console.log("ok");
        console.log(this.deviceId);
    }
    deviceSerialInput() {
        console.log(this.deviceSerial);
    }

}
