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
import { NetworkProvider } from "../../network/NetworkProvider";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@Component({
    selector: 'app-home',
    templateUrl: 'newhome.html'
})
export class NewHomePage {
    constructor(private httpClient: HttpClient,private navCtl:NavController,
        private base: Base,private networkProvider: NetworkProvider, 
        private iAB: InAppBrowser) {
            this.networkProvider.initializeNetworkEvents();
    }
    username: ''
    password: ''
    deviceId: ''
    scanId:''
    version = 3.6

    ionViewDidLoad(){
        this.httpClient.get(this.base.BASE_URL + "app/version").subscribe((res)=>{
            let latestVersion = Number(res.toString());
            if (this.version < latestVersion) {
              this.base.showConfirmAlert("更新","发现新版本，是否立即更新？", ()=>{
                // this.iAB.create("http://192.168.101.34/app-debug.apk",'_system')
                this.iAB.create("http://106.15.200.245/app-debug.apk",'_system')
              }, ()=>{})
            }
          })
        if (localStorage['token']){
            this.navCtl.push(switchProjectPage);
        }
    }

    scan() {
         
         
        this.navCtl.push(ScanPage, { callBack: this.callBack });
    }

    callBack = (params) => {
        return new Promise((resolve, reject) => {
            if (params) {
                // this.base.showConfirmAlert("成功", params.id, () => {
                // }, () => { })
                    this.scanId = params.id;
                     
                this.httpClient.post(this.base.BASE_URL + 'app/queryDeviceId', {},
                        { params: new HttpParams({ fromObject: { scanId: this.scanId } }) })
                        .subscribe(res => {
                             
                            this.deviceId = res[0].id;
                             
                            if(this.deviceId.charAt(8)=='1'){
                                localStorage["TrapDeviceId"] = this.scanId;
                                 

                                // setTimeout(()=>{
                                    this.navCtl.push(TrapQueryPage);
                                // },100)

                            }else if(this.deviceId.charAt(8)=='2'){
                                localStorage["InjectDeviceId"] = this.scanId;
                                 
                                // setTimeout(() => {
                                this.navCtl.push(InjectQueryPage);
                                // },100)
                            }else if(this.deviceId.charAt(8)=='3'){
                                localStorage['queryEnemyID'] = this.scanId;
                                // setTimeout(() => {
                                this.navCtl.push(EnemyQueryPage);
                                // },100)
                            }else if(this.deviceId.charAt(8)=='4'){
                                localStorage["DeadMotherDeviceId"] = this.scanId;
                                // setTimeout(() => {
                                this.navCtl.push(DeadTreesQueryPage);
                                // }, 100)
                            } else if(this.deviceId.charAt(8) == '5'){
                                localStorage["MedicineDeviceId"] = this.scanId;
                                // setTimeout(() => {
                                this.navCtl.push(MedicineQueryPage);
                                // },100)
                            }
                        },res => {

                        })
            } else {

            }
        });
    };


    login() {
         
         
        this.httpClient.post(this.base.BASE_URL + 'login', {},
            { params: new HttpParams({ fromObject: { username: this.username, password: this.password } }) })
            .subscribe(res => {
                 
                 
                localStorage['token'] = res['token'];
                // 直接把用户名密码存了
                localStorage['username'] = this.username;
                localStorage['password'] = this.password;
                sessionStorage['isLogin'] = true
                this.navCtl.push(switchProjectPage);
            },
                res => {
                     
                    this.base.showConfirmAlert('提示', '用户名或者密码错了', () => {

                    }, () => { });

                })

    }

}
