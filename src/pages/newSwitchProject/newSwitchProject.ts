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
import {NewMedicinePage} from '../new-medicine/new-medicine'
import {Diagnostic} from '@ionic-native/diagnostic';

@Component({
    selector: 'app-switchProject',
    templateUrl: 'newSwitchProject.html',
})
export class switchProjectPage {

    constructor(private navCtl: NavController, 
        private alertCtrl: AlertController,
        private httpClient: HttpClient, private base: Base,
        private diagnostic: Diagnostic) {
            //安卓限定
            // this.diagnostic.getLocationMode().then((status) => {
            //     if (status == this.diagnostic.locationMode.DEVICE_ONLY) {
            //         this.diagnostic.switchToLocationSettings();
            //     } else {
            //       this.base.showAlert('提示', '请设置为仅限设备', ()=>{this.diagnostic.switchToLocationSettings();});
            //     }
            //   }).catch((e)=>{alert(e)})

         }

    ionViewDidLoad(){
        this.httpClient.post(this.base.BASE_URL + 'app/getMyDevice', {},
            {
                headers: { token: localStorage['token'] },
                params: new HttpParams({ fromObject: { worker: localStorage['username'] } })
            })
            .subscribe(res => {
                localStorage['device'] = JSON.stringify(res);
            },
                res => {
                    
                })
    }

    trapClick() {
         
        // this.navCtl.push(NewMedicinePage);
        this.navCtl.push(TrapPage);
    }
    dryClick(){
        this.navCtl.push(DryPage);
    }
    deadClick(){
        this.navCtl.push(DeadtreePage);
    }

    medicineClick() {
        //          //控制台输出
        this.navCtl.push(NewMedicinePage);
        //this.navCtl.push(TrapPage);
    }
    exitClick(){
        const alert = this.alertCtrl.create({
            title: "警告!",
            subTitle: "是否要退出系统？",
            buttons: [
                {
                    text: '确认', handler: () => {
                    localStorage.removeItem("token");
                    this.navCtl.push(NewHomePage);
                         
                    }
                },
                {
                    text: '取消', handler: () => {
                         
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
}
