import { Component } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { NavController } from 'ionic-angular';
import { switchProjectPage} from '../newSwitchProject/newSwitchProject'
import { Base } from '../../common/base.js'

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
    
    ionViewDidLoad(){
        if (localStorage['token']){
            this.navCtl.push(switchProjectPage);
        }
    }

    login() {
        console.log(this.username);
        console.log(this.password);
<<<<<<< HEAD
        this.httpClient.post("http://106.15.90.78:8081/" + 'login', {},
=======
        this.httpClient.post(this.base.BASE_URL + 'login', {},
>>>>>>> 60b61d179c92d69136233d71fd6096761bf21c96
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
<<<<<<< HEAD
                    
=======
                    this.base.showConfirmAlert('提示', '用户名或者密码错了', () => {
                        
                    }, () => { });
>>>>>>> 60b61d179c92d69136233d71fd6096761bf21c96

                })

    }

}
