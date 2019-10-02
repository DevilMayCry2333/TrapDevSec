import { Component } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: 'newDeadTree.html'
})
export class DeadtreePage {
    deviceId: '';
    deviceSerial: '';
    longtitude: '';
    latitude: '';
    altitude: '';
    accuracy: '';
    newbettle: '';
    otherbettle: '';
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

    constructor() { }

    trapClick() {
        console.log('deadtree');
    }
    deviceIdInput() {
        console.log('ok');
        console.log(this.deviceId);
    }
    deviceSerialInput() {
        console.log(this.deviceSerial);
    }

}