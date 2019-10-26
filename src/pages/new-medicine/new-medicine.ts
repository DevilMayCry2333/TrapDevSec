import { Component } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient, HttpParams } from "@angular/common/http";
import { ScanPage } from '../scan/scan'
import { Base } from '../../common/base.js'
import { Subscription } from "rxjs/Subscription";
import { Geolocation } from "@ionic-native/geolocation";
import { ChangeDetectorRef } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FileTransfer, FileTransferObject, FileUploadOptions } from "@ionic-native/file-transfer";
import { AboutPage } from '../about/about';
import { InjectQueryPage} from '../inject-query/inject-query';
/**
 * Generated class for the NewMedicinePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-new-medicine',
  templateUrl: 'new-medicine.html',
})

export class NewMedicinePage {
    deviceId: ""
    deviceSerial: ""
    longtitude: string
    woodStatusValue:string
    workContentValue:string
    latitude: string
    subscription: Subscription;
    altitude: string
    imageData:""
    accuracy: string
    medicinename:any[]
    medicinenumber:string
    controlarea:string
    have_submit:boolean
    medicineworkContent:any[]
    remarks = ""
    location_ready:boolean
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


    constructor(
          public qrScanner: QRScanner,
          private base: Base,
          private geolocation: Geolocation,
          private changeDetectorRef: ChangeDetectorRef,
          private httpClient: HttpClient,
          private camera: Camera,
          private fileTransfer: FileTransfer,
          public navCtrl: NavController
  ) { }


  deviceBind() {
    //这里还没有实现，先弹框
    this.base.showAlert("成功", "", () => { });
}

  NavToMap() {
    this.navCtrl.push(AboutPage);
}


  bindNewId() {
        if(this.deviceId == undefined || this.deviceId=="" || this.deviceSerial == undefined || this.deviceSerial == ""){
            this.base.showAlert("提示","请先输入设备ID和设备编号!",()=>{})
          }else{
            this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
          {
              headers: { token: localStorage['token'] }, params: {
                  scanId: this.deviceId, serial: this.deviceSerial
              }
          })
          .subscribe(res => {
              console.log(JSON.stringify(res));
              console.log(JSON.parse(JSON.stringify(res)).message);
              // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
              this.base.showAlert('提示', '提交成功', () => { });
              console.log("cacheData");

              Base.popTo(this.navCtrl, 'switchProjectPage');
          }, (msg) => {

              // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

              this.base.showAlert("提交失败", "提交失败", () => { });
              console.log(msg);
              console.log("失败");
              var transferParam = { scanId: this.deviceId, serial: this.deviceSerial };
              let BindIdCache: any;
              BindIdCache = localStorage.getItem('trapBind');

              if (BindIdCache == null) {
                  BindIdCache = [];
              } else {
                  BindIdCache = JSON.parse(BindIdCache);
              }
              BindIdCache.push(transferParam);

              localStorage.setItem("medicineBind", JSON.stringify(BindIdCache));
          });
  }
}

ionViewDidLoad() {
    // console.log('ionViewDidLoad NewMedicinePage');
    if (localStorage["medicineBind"]) {
      var tmpStorage2 = [];

      tmpStorage2 = JSON.parse(localStorage["medicineBind"]);

      console.log(tmpStorage2.length);
      // localStorage.removeItem("trapBind");

      console.log(tmpStorage2);
      var i = 0;

      tmpStorage2.forEach(element => {

          console.log("===开始===");

          console.log(element.scanId);
          console.log(element.serial);

          this.httpClient.post(this.base.BASE_URL + 'app/bindId', {},
              {
                  headers: { token: localStorage['token'] },
                  params: new HttpParams({ fromObject: { scanId: element.scanId, serial: element.serial } })
              })
              .subscribe(res => {
                  console.log(res);
                  i++;
                  this.base.showAlert("成功绑定了", "", () => { });
                  if (tmpStorage2.length == i) {
                      localStorage.removeItem("medicineBind");
                      this.base.showAlert("清理了缓存", "", () => { });
                  }
              },
                  msg => {

                  })
      })
    }
    
    console.log('ionViewDidLoad LocatePage');
    console.log(localStorage['device']);
    if (localStorage["medicineCache"]) {
        var tmpStorage = JSON.parse(localStorage["medicineCache"]);
        var i = 0;
        tmpStorage.forEach(element => {
            console.log(element);
            if (element.img != null) {
                let options: FileUploadOptions = {};
                options.fileKey = "image";
                var time = Date.parse(Date());
                options.fileName = time + ".jpg";
                options.mimeType = "image/jpeg";
                options.chunkedMode = false;
                options.httpMethod = "POST";
                options.params = {
                    deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                    accuracy: element.accuracy, medicinename: element.medicinename, medicinenumber: element.medicinenumber, remarks: element.remarks,
                    medicineWorkContent: element.medicineWorkContent
                };
                options.headers = { token: localStorage['token'] };
                console.log("options");
                console.log(options);


                //创建文件对象
                const fileTransfer: FileTransferObject = this.fileTransfer.create();


                // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

                fileTransfer.upload(element.img, this.base.BASE_URL + 'app/Addmedicine', options)
                    .then((res) => {
                        console.log(res);
                        console.log(JSON.stringify(res));
                        console.log(JSON.parse(JSON.stringify(res)).message);
                        i++;
                        // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                        // this.base.showAlert('提示', '提交成功', () => { });
                        if (i >= tmpStorage.length)
                            localStorage.removeItem('medicineCache');
                    }, (error) => {//发送失败(网络出错等)
                        console.log(error);
                            this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
                                {
                                    headers: { token: localStorage['token'] }, params: {
                                      deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                                      accuracy: element.accuracy, medicinename: element.medicinename, medicinenumber: element.medicinenumber, remarks: element.remarks,
                                      medicineWorkContent: element.medicineWorkContent
                                    }
                                })
                                .subscribe(res => {
                                    i++;
                                    console.log(JSON.stringify(res));
                                    console.log(JSON.parse(JSON.stringify(res)).message);
                                    // this.base.showAlert('提示', '提交成功', () => { });
                                    if(i>=tmpStorage.length)
                                        localStorage.removeItem('medicineCache');
                                }, (msg) => {
                                    // this.base.showAlert('提示', '提交失败', () => { });
                                });
                        // this.base.showAlert('提示', '提交失败', () => { });
                    })
            } else {
                console.log(element);
                this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
                    {
                        headers: { token: localStorage['token'] }, params: {
                          deviceId: element.deviceId, longitude: element.longitude, latitude: element.latitude, altitude: element.altitude,
                          accuracy: element.accuracy, medicinename: element.medicinename, medicinenumber: element.medicinenumber, remarks: element.remarks,
                          medicineWorkContent: element.medicineWorkContent
                        }
                    })
                    .subscribe(res => {
                        i++;
                        console.log(JSON.stringify(res));
                        console.log(JSON.parse(JSON.stringify(res)).message);
                        // this.base.showAlert('提示', '提交成功', () => { });
                        if(i>=tmpStorage.length)
                            localStorage.removeItem('medicineCache');
                    }, (msg) => {
                        // this.base.showAlert('提示', '提交失败', () => { });
                    });
            }
        });
    }

    // 药剂名称
    if (localStorage["Medicinename"]) {
        console.log(localStorage["Medicinename"]);
        this.medicinename = JSON.parse(localStorage["Medicinename"]);
        console.log("缓存");
        console.log(this.medicinename);
    }

    this.httpClient.post(this.base.BASE_URL + 'app/getMedicinename', {},
        {
            headers: { token: localStorage['token'] },
            params: new HttpParams({ fromObject: { worker: localStorage['username'] } })
        })
        .subscribe(res => {
            var c: any = res;
            this.medicinename = Array.from(c);
            console.log(this.medicinename);
            localStorage['Medicinename'] = JSON.stringify(res);

        },
            res => {
                console.log(res);
            })

    //药剂数量不需要后端获取



    // 工作内容
    if (localStorage["MedicineWorkContent"]) {
        console.log(localStorage["MedicineWorkContent"]);
        this.medicineworkContent = JSON.parse(localStorage["MedicineWorkContent"]);
        console.log("缓存");
        console.log(this.medicineworkContent);
    }

    this.httpClient.post(this.base.BASE_URL + 'app/getMedicineWorkContent', {},
        {
            headers: { token: localStorage['token'] },
            params: new HttpParams({ fromObject: { worker: localStorage['username'] } })
        })
        .subscribe(res => {
            var c: any = res;
            this.medicineworkContent = Array.from(c);
            console.log(this.medicineworkContent);
            localStorage['MedicineWorkContent'] = JSON.stringify(res);

        },
            res => {
                console.log(res);
            })

}

takePhoto() {
    const options: CameraOptions = {
        quality: 10,
        destinationType: this.camera.DestinationType.FILE_URI,
        sourceType: 1,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true,
        saveToPhotoAlbum: true
    };
    this.camera.getPicture(options).then((imageData) => {
        // this.submit(imageData)
        // this.navCtrl.popToRoot()
        this.imageData = imageData;
    }, (err) => {
        // Handle error
        // this.navCtrl.popToRoot()
    }).catch((error) => {
        console.log(error)
    });
}

callBack = (params) => {
    return new Promise((resolve, reject) => {
        if (params) {
            console.log(params.id);
            var allDevice = JSON.parse(localStorage["device"]);
            console.log(localStorage["device"]);
            console.log("Array");
            console.log(allDevice[0]);

            var flag = 0;
            console.log(params.id.charAt(8) === "2");

            allDevice.forEach(element => {
                console.log("element");
                // console.log(element);
                if ((element.scanId == params.id && params.id.charAt(8) == '2') || params.id.charAt(8) == '7')
                    flag = 1;
            });
            if (flag == 1) {
                this.deviceId = params.id;
                let options = {
                    enableHighAccuracy: true,
                    timeout: 99999999,
                    maximumAge: 0
                };
                let that = this
                let watch = this.geolocation.watchPosition(options);

                this.subscription = watch.subscribe((data) => {
                    // data can be a set of coordinates, or an error (if an error occurred).
                    if (data['coords']) {
                        // setTimeout(() => {
                        this.latitude = String(data.coords.latitude);
                        sessionStorage['latitude'] = String(data.coords.latitude);
                        this.longtitude = String(data.coords.longitude);
                        sessionStorage['longitude'] = String(data.coords.longitude);
                        this.altitude = String(data.coords.altitude);
                        sessionStorage['altitude'] = String(data.coords.altitude);

                        this.accuracy = String(data.coords.accuracy);

                        // 不是可以在这里直接判断海拔是不是null吗。。。。
                        if (data.coords.altitude == null) {
                            this.altitude = '-10000';
                            sessionStorage['altitude'] = '-10000';
                            //this.base.showAlert('提示','gps信号弱，请等待',()=>{});

                        }
                        setTimeout(() => {
                            //this.location_ready = true;
                            this.location_ready = true;
                            that.changeDetectorRef.detectChanges()

                        }, 5000);
                        // document.getElementById('latitude').innerText="纬度:" + sessionStorage['latitude']
                        // document.getElementById('longitude').innerText="经度:" + sessionStorage['longitude']
                        // document.getElementById('altitude').innerText="海拔:" + sessionStorage['altitude']
                        // document.getElementById('sumbit_button').removeAttribute('disabled')
                        that.changeDetectorRef.detectChanges()
                        // },5);
                        // if(this.altitude==null){
                        //   this.location_ready = false;
                        //   this.base.showAlert('提示','海拔获取失败，请重新获取',()=>{});        
                        // }
                    }
                    // else{
                    //   this.base.showAlert('提示','gps信号弱，请等待',()=>{});
                    // }
                }, res => {
                    // setTimeout(() => {
                    //    this.base.showAlert('提示','wu',()=>{});
                    this.location_ready = false;
                    that.changeDetectorRef.detectChanges()

                    // 这个是在数据更新后。。。强制刷一下页面。。。放在数据变更后才有用。。。
                    // },5);

                    // alert();
                });

                this.base.showConfirmAlert("成功", params.id, () => {
                }, () => { })
            } else {
                this.base.showConfirmAlert("二维码无效", params.id, () => {
                }, () => { })
            }
        } else {

        }
    });
};

NavToQuery(){
    if(this.deviceId){
        localStorage["MedicineDeviceId"] = this.deviceId;
        this.navCtrl.push(InjectQueryPage);
    }else{
        this.base.showAlert("提示", "请先扫码或输入数字的设备ID!", () => { });
    }

}
scan() {
    console.log("scan");
    console.log(localStorage['username']);
    this.navCtrl.push(ScanPage, { callBack: this.callBack });
}

submit() {
    this.have_submit = true;
    let num1 = 0;
    console.log(this.medicinenumber);
    if (parseInt(this.medicinenumber) < 0 || parseInt(this.medicinenumber) == NaN) {
        console.log("medicinenumber不合法");
        this.medicinenumber = "";
        // this.base.showAlert('提示', '请输入数字', () => { });
    }
    if (!this.medicinenumber) {
        console.log("medicinenumber不合法");
        this.medicinenumber = "";
        // this.base.showAlert('提示', '请输入数字', () => { });
    }
    num1 = parseInt(this.medicinenumber);
    this.medicinenumber = '' + num1;
    if (this.medicinenumber == 'NaN') {
        console.log("medicinenumber不合法");
        this.medicinenumber = "";
        // this.base.showAlert('提示', '请输入数字', () => { });
    }

    // if (!this.woodStatusValue){
    //     this.woodStatusValue = "0";
    // }
    // if (!this.medicinenumber){
    //     this.medicinenumber = "0";
    // }
    // if (!this.workContentValue){
    //     this.workContentValue = "0";
    // }
    if (!this.altitude || !this.longtitude || !this.latitude || !this.accuracy || !this.medicinename || !this.medicinenumber || !this.medicineworkContent || parseInt(this.medicinenumber) < 0 || parseInt(this.medicinenumber) == NaN || !this.medicinenumber || this.medicinenumber == 'NaN') {
        this.base.showAlert("提示", "数量输入为空或者不合法", () => { });
        
    } else {
        if (this.imageData != null) {
            let options: FileUploadOptions = {};
            options.fileKey = "image";
            var time = Date.parse(Date());
            options.fileName = time + ".jpg";
            options.mimeType = "image/jpeg";
            options.chunkedMode = false;
            options.httpMethod = "POST";
            options.params = {
              deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
              accuracy: this.accuracy, medicinename: this.medicinename, medicinenumber: this.medicinenumber, remarks: this.remarks,
              medicineWorkContent: this.medicineworkContent
            };
            options.headers = { token: localStorage['token'] };
            console.log("options");
            console.log(options);
            
            //创建文件对象
            const fileTransfer: FileTransferObject = this.fileTransfer.create();


            // this.base.logger(JSON.stringify(options), "Img_maintenance_submit_function_fileTransferPar.txt");

            fileTransfer.upload(this.imageData, this.base.BASE_URL + 'app/Addmedicine', options)
                .then((res) => {
                    console.log(res);
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);

                    // this.base.logger(JSON.stringify(res), "Img_maintenance_submit_function_fileTransferRes.txt");

                    this.base.showAlert('提示', '提交成功', () => { });
                    Base.popTo(this.navCtrl, 'switchProjectPage');
                }, (error) => {//发送失败(网络出错等)
                    this.base.showAlert('提示', '提交失败', () => { });
                    // this.base.logger(JSON.stringify(error), "Img_maintenance_submit_function_fileTransferError.txt");

                    let cacheData = {
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, WoodStatus: this.woodStatusValue, medicinenumber: this.medicinenumber, remarks: this.remarks,
                        workingContent: this.workContentValue,
                        img: this.imageData
                    };
                    let medicineCache: any;
                    medicineCache = localStorage.getItem('medicineCache');
                    if (medicineCache == null) {
                        medicineCache = [];
                    } else {
                        medicineCache = JSON.parse(medicineCache);
                    }
                    medicineCache.push(cacheData);
                    //localStorage安全保存数据
                    // try{
                    //   localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                    // }catch(oException){
                    //     if(oException.name == 'QuotaExceededError'){
                    //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                    //         //console.log('已经超出本地存储限定大小！');
                    //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                    //       // localStorage.clear();
                    //       // localStorage.setItem(key,value);
                    //     }
                    // } 

                    localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                    //this.navCtrl.pop();
                    // confirm.dismiss()
                        Base.popTo(this.navCtrl, 'switchProjectPage');
                })
            .catch((error) => {//发送失败(文件不存在等)
                this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
                    {
                        headers: { token: localStorage['token'] }, params: {
                            deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                            accuracy: this.accuracy, WoodStatus: this.woodStatusValue, medicinenumber: this.medicinenumber, remarks: this.remarks,
                            workingContent: this.workContentValue
                        }
                    })
                    .subscribe(res => {
                        console.log(JSON.stringify(res));
                        console.log(JSON.parse(JSON.stringify(res)).message);
                        // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                        this.base.showAlert('提示', '提交成功', () => { });
                        let cacheData = {
                            deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                            accuracy: this.accuracy, WoodStatus: this.woodStatusValue, medicinenumber: this.medicinenumber, remarks: this.remarks,
                            workingContent: this.workContentValue
                        };
                        console.log("cacheData");
                        console.log(cacheData);

                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    }, (msg) => {

                        // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                        this.base.showAlert('提示', '提交失败', () => { });
                        let cacheData = {
                            deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                            accuracy: this.accuracy, WoodStatus: this.woodStatusValue, medicinenumber: this.medicinenumber, remarks: this.remarks,
                            workingContent: this.workContentValue
                        };
                        console.log("cacheData");
                        console.log(cacheData);

                        let medicineCache: any;
                        medicineCache = localStorage.getItem('medicineCache');
                        if (medicineCache == null) {
                            medicineCache = [];
                        } else {
                            medicineCache = JSON.parse(medicineCache);
                        }
                        medicineCache.push(cacheData);
                        // try{
                        //   localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                        // }catch(oException){
                        //     if(oException.name == 'QuotaExceededError'){
                        //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                        //         //console.log('已经超出本地存储限定大小！');
                        //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                        //       // localStorage.clear();
                        //       // localStorage.setItem(key,value);
                        //     }
                        // }   
                        localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                        console.log("Hello");

                        //this.navCtrl.pop();
                        // confirm.dismiss();
                        Base.popTo(this.navCtrl, 'switchProjectPage');
                    });

            });
        } else {

            // var options: string = "deviceId: " + this.id +
            //     "longitude:" + this.longitude + "latitude:" + this.latitude + "num:" + this.num +
            //     "maleNum:" + this.maleNum + "femaleNum:" + this.femaleNum + "altitude:" + this.altitude +
            //     "drug:" + this.drug + "remark:" + this.remark + "workingContent:" + this.workingContent + "otherNum:" + this.otherNum + "otherType:" + this.otherType;


            // this.base.logger(options, "NonImg_maintenance_submit_function_fileTransferPar.txt");

            this.httpClient.post(this.base.BASE_URL + 'app/Addmedicine', {},
                {
                    headers: { token: localStorage['token'] }, params: {
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, WoodStatus: this.woodStatusValue, medicinenumber: this.medicinenumber, remarks: this.remarks,
                        workingContent: this.workContentValue
                    }
                })
                .subscribe(res => {
                    console.log(JSON.stringify(res));
                    console.log(JSON.parse(JSON.stringify(res)).message);
                    // this.base.logger(JSON.stringify(res), "NonImg_maintenance_submit_function_fileTransferRes.txt");
                    this.base.showAlert('提示', '提交成功', () => { });
                    let cacheData = {
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, WoodStatus: this.woodStatusValue, medicinenumber: this.medicinenumber, remarks: this.remarks,
                        workingContent: this.workContentValue
                    };
                    console.log("cacheData");
                    console.log(cacheData);

                    Base.popTo(this.navCtrl, 'switchProjectPage');
                }, (msg) => {

                    // this.base.logger(JSON.stringify(msg), "NonImg_maintenance_submit_function_fileTransferError.txt");

                    this.base.showAlert('提示', '提交失败', () => { });
                    let cacheData = {
                        deviceId: this.deviceId, longitude: this.longtitude, latitude: this.latitude, altitude: this.altitude,
                        accuracy: this.accuracy, WoodStatus: this.woodStatusValue, medicinenumber: this.medicinenumber, remarks: this.remarks,
                        workingContent: this.workContentValue
                    };
                    console.log("cacheData");
                    console.log(cacheData);

                    let medicineCache: any;
                    medicineCache = localStorage.getItem('medicineCache');
                    if (medicineCache == null) {
                        medicineCache = [];
                    } else {
                        medicineCache = JSON.parse(medicineCache);
                    }
                    medicineCache.push(cacheData);
                    // try{
                    //   localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                    // }catch(oException){
                    //     if(oException.name == 'QuotaExceededError'){
                    //         this.base.showAlert('提示', '无法提交，缓存容量不足，请及时处理', ()=>{});
                    //         //console.log('已经超出本地存储限定大小！');
                    //             // 可进行超出限定大小之后的操作，如下面可以先清除记录，再次保存
                    //       // localStorage.clear();
                    //       // localStorage.setItem(key,value);
                    //     }
                    // }   
                    localStorage.setItem('medicineCache', JSON.stringify(medicineCache));
                    console.log("Hello");

                    //this.navCtrl.pop();
                    // confirm.dismiss();
                        Base.popTo(this.navCtrl, 'switchProjectPage');
                });

        }
}

}

medicineClick() {
    console.log("medicine");
}
deviceIdInput() {
    console.log("ok");
    console.log(this.deviceId);
}
deviceSerialInput() {
    console.log(this.deviceSerial);
}

//药剂数量
medicinenumberInput(){
    let num1 = 0;
    if (parseInt(this.medicinenumber) < 0 || parseInt(this.medicinenumber) == NaN) {
        this.base.showAlert('提示', '请输入数字', () => { });
    }
    if (!this.medicinenumber) {
        this.base.showAlert('提示', '请输入数字', () => { });
    }
    num1 = parseInt(this.medicinenumber);
    this.medicinenumber = '' + num1;
    if (this.medicinenumber == 'NaN') {
        this.base.showAlert('提示', '请输入数字', () => { });
    }
}
}
