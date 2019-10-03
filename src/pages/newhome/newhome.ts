import { Component } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { NavController } from 'ionic-angular';
import { switchProjectPage} from '../newSwitchProject/newSwitchProject'
@Component({
    selector: 'app-home',
    templateUrl: 'newhome.html'
})
export class NewHomePage {
    constructor(private httpClient: HttpClient,private navCtl:NavController) {

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
        this.httpClient.post("http://192.168.1.6:8081/" + 'login', {},
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
                })

    }

}
