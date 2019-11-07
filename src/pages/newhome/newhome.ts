import { Component } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { NavController } from 'ionic-angular';
import { switchProjectPage} from '../newSwitchProject/newSwitchProject'
import { Base } from '../../common/base.js'
import { ScanPage } from '../scan/scan'
import { TrapQueryPage } from '../trap-query/trap-query';
import { InjectQueryPage } from '../inject-query/inject-query';
import { EnemyQueryPage } from '../enemy-query/enemy-query';
import { DeadTreesQueryPage } from '../dead-trees-query/dead-trees-query';
import { MedicineQueryPage } from '../medicine-query/medicine-query';


@Component({
    selector: 'app-home',
    templateUrl: 'newhome.html'
})
export class NewHomePage {
    constructor(private httpClient: HttpClient,private navCtl:NavController,
        private base: Base) {

    }
    username: ''
    password: ''
    deviceId: ''
    scanId:''
    
    ionViewDidLoad(){
        if (localStorage['token']){
            this.navCtl.push(switchProjectPage);
        }
    }

    scan() {
        console.log("scan");
        console.log(localStorage['username']);
        this.navCtl.push(ScanPage, { callBack: this.callBack });
    }

    callBack = (params) => {
        return new Promise((resolve, reject) => {
            if (params) {
                // this.base.showConfirmAlert("成功", params.id, () => {
                // }, () => { })
                    this.scanId = params.id;
                    console.log(this.scanId);
                this.httpClient.post(this.base.BASE_URL + 'app/queryDeviceId', {},
                        { params: new HttpParams({ fromObject: { scanId: this.scanId } }) })
                        .subscribe(res => {
                            console.log(res);
                            this.deviceId = res[0].id;
                            console.log(this.deviceId);
                            if(this.deviceId.charAt(8)=='1'){
                                localStorage["TrapDeviceId"] = this.deviceId;
                                this.navCtl.push(TrapQueryPage);
                            }else if(this.deviceId.charAt(8)=='2'){
                                localStorage["InjectDeviceId"] = this.deviceId;
                                this.navCtl.push(InjectQueryPage);
                            }else if(this.deviceId.charAt(8)=='3'){
                                localStorage['queryEnemyID'] = this.deviceId;
                                this.navCtl.push(EnemyQueryPage);
                            }else if(this.deviceId.charAt(8)=='4'){
                                localStorage["DeadMotherDeviceId"] = this.deviceId;
                                this.navCtl.push(DeadTreesQueryPage);
                            } else if(this.deviceId.charAt(8) == '5'){
                                localStorage["MedicineDeviceId"] = this.deviceId;
                                this.navCtl.push(MedicineQueryPage);
                            }
                        },res => {

                        })
            } else {

            }
        });
    };

    
    login() {
        console.log(this.username);
        console.log(this.password);
        this.httpClient.post(this.base.BASE_URL + 'login', {},
            { params: new HttpParams({ fromObject: { username: this.username, password: this.password } }) })
            .subscribe(res => {
                console.log(res);
                console.log(res['token']);
                localStorage['token'] = res['token'];
                // 直接把用户名密码存了
                localStorage['username'] = this.username;
                localStorage['password'] = this.password;
                sessionStorage['isLogin'] = true
                this.navCtl.push(switchProjectPage);
            },
                res => {
                    console.log(res);
                    this.base.showConfirmAlert('提示', '用户名或者密码错了', () => {
                        
                    }, () => { });

                })

    }

}
