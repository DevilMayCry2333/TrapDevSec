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

@Component({
    selector: 'app-switchProject',
    templateUrl: 'newSwitchProject.html',
})
export class switchProjectPage {

    constructor(private navCtl: NavController, private httpClient: HttpClient, private base: Base) { }

    ionViewDidLoad(){
        this.httpClient.post(this.base.BASE_URL + 'app/getMyDevice', {},
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
        localStorage.removeItem("token");
        this.navCtl.push(NewHomePage);
    }
    enemyClick(){
        this.navCtl.push(EnemyPage);
    }
    trackClick(){
        this.navCtl.push(TrackPage);
    }

}
