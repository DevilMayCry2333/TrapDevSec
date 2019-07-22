import {Injectable} from "@angular/core";
import {NativeTransitionOptions} from "@ionic-native/native-page-transitions";
import { AlertController } from 'ionic-angular';
import { text } from "@angular/core/src/render3/instructions";
import { File } from "@ionic-native/file";

@Injectable()
export class Base {
  BASE_URL = "http://39.108.184.47:8081/"
  transitionOptions: NativeTransitionOptions = {
    direction: 'left',
    duration: 200,
    slowdownfactor: 3,
    slidePixels: 20,
    iosdelay: 0,
    androiddelay: 0,
    fixedPixelsTop: 0,
    fixedPixelsBottom: 60
  };
  constructor(private alertCtrl: AlertController, private file: File) {

  }

  showAlert(title, content, func) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: content,
      buttons: [{text:'确认', handler: func}]
    });
    alert.present();
  }

  logger(info:string,storage:string){
    this.file.writeFile(this.file.externalDataDirectory, storage, '[' + info + '],', { replace: true }).then(function (success) {
      console.log(success);
      // success
    }, function (error) {
      console.log(error);
      // error
    });
  }
  
  showPrompt(title, myName,func1, func2) {
    const prompt = this.alertCtrl.create({
      title: title,
      inputs: [
        {
          type:'text',
          name: myName,  
          placeholder: '设备id'        
        }

      ],
      buttons: [
        {
          text: '取消',
          handler: func2
        },
        {
          text: '确认',
          handler: (data)=>{
            func1(data);
          }
        }
      ]
    });
    prompt.present();
  }


  showConfirmAlert(title, content, func1, func2) {
    const confirm = this.alertCtrl.create({
      title: title,
      message: content,
      buttons: [
        {
          text: '取消',
          handler: func2
        },
        {
          text: '确认',
          handler: ()=>{
            func1(confirm);
          }
        }
      ]
    });
    confirm.present();
  }

  static popTo(navCtrl, name) {
    let views = navCtrl.getViews();
    let target = -1;
    for (let i = 0; i < views.length; ++i) {
      if (views[i].name == name) {
        target = i;
        break;
      }
    }
    if (target >= 0) {
      navCtrl.popTo(navCtrl.getByIndex(target)).then(()=>{});
    }

  }
}