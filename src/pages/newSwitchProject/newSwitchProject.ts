import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TrapPage} from '../newTrap/newTrap'
import { DryPage} from '../newDry/newDry';
import { EnemyPage} from '../newEnemy/newEnemy';
import { DeadtreePage} from '../newDeadTree/newDeadTree';
import { TrackPage} from '../newTrack/newTrack';
import { HttpClient, HttpParams } from "@angular/common/http";
import { NewHomePage} from "../newhome/newhome";
import { Base } from '../../common/base.js'
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'app-switchProject',
    templateUrl: 'newSwitchProject.html',
})
export class switchProjectPage {
    alertCtrl: any;

    constructor(private navCtl: NavController, 
        private alertCtrl: AlertController,
        private httpClient: HttpClient, private base: Base) { }

    ionViewDidLoad(){
<<<<<<< HEAD
        this.httpClient.post("http://106.15.90.78:8081/app/" + 'getMyDevice', {},
=======
        this.httpClient.post(this.base.BASE_URL + 'app/getMyDevice', {},
>>>>>>> 60b61d179c92d69136233d71fd6096761bf21c96
            {
                headers: { token: localStorage['token'] },
                params: new HttpParams({ fromObject: { worker: localStorage['username'] } })
            })
            .subscribe(res => {
                console.log(res);
                localStorage['device'] = JSON.stringify(res);
            },
                res => {
                    console.log(res);
                })
    }

    trapClick() {
        console.log("trap");
        this.navCtl.push(TrapPage);
    }
    dryClick(){
        this.navCtl.push(DryPage);
    }
    deadClick(){
        this.navCtl.push(DeadtreePage);
    }
    exitClick(){
        const alert = this.alertCtrl.create({
            title: "警告!!",
            subTitle: "是否要退出系统???????",
            buttons: [
                {
                    text: '确认', handler: () => {
                    localStorage.removeItem("token");
                    this.navCtl.push(NewHomePage);
                        console.log("ok");
                    }
                },
                {
                    text: '取消', handler: () => {
                        console.log("cancel");
                    }
                }

        ]
        });
        alert.present();

        // localStorage.removeItem("token");
        // this.navCtl.push(NewHomePage);
    }
    enemyClick(){
        this.navCtl.push(EnemyPage);
    }
    trackClick(){
        this.navCtl.push(TrackPage);
    }
    exitClick(){
        const alert = this.alertCtrl.create({
            title: "警告!!",
            subTitle: "是否要退出系统?",
            buttons: [
                {
                    text: '确认', handler: () => {
                    localStorage.removeItem("token");
                    this.navCtl.push(NewHomePage);
                        console.log("ok");
                    }
                },
                {
                    text: '取消', handler: () => {
                        console.log("cancel");
                    }
                }

        ]
        });
        alert.present();

        // localStorage.removeItem("token");
        // this.navCtl.push(NewHomePage);
    }
}
