import { Component, ElementRef, ViewChild, Inject} from '@angular/core';
import { NavController } from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import { Geolocation } from "@ionic-native/geolocation";
import { Subscription } from "rxjs/Subscription";

import {TabsPage} from "../tabs/tabs";
import {Base} from "../../common/base.js";
import {CoordinateConvertor} from "../../common/coordinate-convertor";
import { AlertController } from 'ionic-angular';
import { File } from "@ionic-native/file";
import { ChangeDetectorRef } from '@angular/core';



// import * as MarkerClusterer from "../../../node_modules/@types/markerclustererplus/index";
declare var BMap;
declare var BMap_Symbol_SHAPE_POINT;
// declare var BMapLib;
var markers = [];
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {


  // @ViewChild('map') mapElement: ElementRef;
  @ViewChild('map2') map_container2: ElementRef;
  map: any;//地图对象
  marker: any;//标记
  subscription: Subscription;

  // 是否定位成功
  location_ready = false;

  //username = '';

  // 经度
  longitude = '';

  // 纬度
  latitude = '';

  // 海拔
  altitude = '';

  // 精度
  accuracy = '';


  constructor(public navCtrl: NavController, private httpClient: HttpClient, private base: Base,
    private coordinateConvertor: CoordinateConvertor, @Inject(AlertController) private alerts: AlertController, private file: File, private geolocation: Geolocation, private changeDetectorRef: ChangeDetectorRef) {

    // let map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true });//创建地图实例
    //
    // // map.centerAndZoom("广州",17); //设置城市设置中心和地图显示级别
    // let point = new BMap.Point(113.23, 23.16);//坐标可以通过百度地图坐标拾取器获取
    // map.centerAndZoom(point, 17);//设置中心和地图显示级别
    //
    // map.addControl(new BMap.MapTypeControl());
    // // map.setCurrentCity("广州");
    //
    // let sizeMap = new BMap.Size(10, 80);//显示位置
    // map.addControl(new BMap.NavigationControl());
    //
    // map.centerAndZoom('中国', 5);
  }

  locate() {
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
        this.longitude = String(data.coords.longitude);
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

  }


  ionViewDidLoad(){
    let map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true });//创建地图实例
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
    var i: number = 1;
    var that = this;
    function addMarker(point, index) {  // 创建图标对象   
      var myIcon = new BMap.Icon("https://youkaiyu.com/myLocation.jpeg", new BMap.Size(23, 25), {
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
        // 图标中央下端的尖角位置。    
        anchor: new BMap.Size(10, 25),
        // 设置图片偏移。   
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
      });
      // 创建标注对象并添加到地图   
      var marker = new BMap.Marker(point, { icon: myIcon });
      map.addOverlay(marker);
    }
    let append = '';
    setInterval(() => {
      this.locate();

      // if (this.altitude != '-10000' && !this.altitude && this.altitude!="")
        
      if (this.latitude && this.longitude){
        // const alert = this.alerts.create({
        //   title: '数据',
        //   enableBackdropDismiss: false,
        //   buttons: [
        //     {
        //       text: this.latitude + ',' + this.longitude + ',' + this.altitude,
        //       handler: () => {
        //       }
        //     }
        //   ]
        // });
        // alert.present();
        setTimeout(() => {
            var point = this.coordinateConvertor.wgs2bd(Number(this.latitude), Number(this.longitude));


            var point2 = new BMap.Point(point[1], point[0]);
            
              var mk = new BMap.Marker(point2);
              map.addOverlay(mk);
              map.panTo(point2);
              console.log(point2);
          // this.base.showAlert("提示", point2.lat.toString() + point2.lng.toString(), () => { });
          // alert('您的位置：' + point2.lng + ',' + point2.lat);




              map.centerAndZoom(point2, 15);  // 编写自定义函数，创建标注   


              addMarker(point2, i);

            append += this.latitude + ',' + this.longitude + ',' + this.altitude;

            // this.base.logger(append,"about_ionViewDidLoad.txt");

            i++;
      },5000)
    }
    }, 30000);
  }
  ionViewDidEnter() {
    var myPoint = [];
    let map = this.map = new BMap.Map(this.map_container2.nativeElement, {enableMapClick: true});//创建地图实例
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
 
    // setInterval("this.myLocation()",5000);
    // this.myLocation();
    map.centerAndZoom('中国', 5);

    map.addControl(new BMap.MapTypeControl());

    let sizeMap = new BMap.Size(10, 80);//显示位置
    map.addControl(new BMap.NavigationControl());


    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用





    this.httpClient.get(this.base.BASE_URL + 'auth_api/user', {headers: {token: localStorage['token']}})
      .subscribe(data => {
        // console.log(d);
        var center = '';
        if (data['town'] != null)
          center = data['town'] + center;
        if (data['city'] != null)
          center = data['city'] + center;
        if (data['area'] != null)
          center = data['area'] + center;
        if (data['province'] != null)
          center = data['province'] + center;
        if (center)
          map.centerAndZoom(center, 11);
      })
    this.httpClient.get(this.base.BASE_URL + 'auth_api/device_list', {headers: {token:localStorage['token']},
      params: {searchText:"", limit:"2000", page:"1"}}).subscribe(res=>{

      for (var i = 0; i < res['data'].length; i++) {
        if (res['data'][i].longitude && res['data'][i].latitude) {
          if(i==0)
            console.log(res['data'][i].latitude);

          var point = this.coordinateConvertor.wgs2bd(res['data'][i].latitude, res['data'][i].longitude);
          point = new BMap.Point(point[1], point[0]);
          markers.push(point);
          // this.addMarker(point);
        }
      }
        this.addMarker()
    })





    var a = setInterval(() => {
      this.locate();
    }, 1000)

    function addMarker(point, index) {  // 创建图标对象   
      var myIcon = new BMap.Icon("https://youkaiyu.com/myLocation.jpeg", new BMap.Size(23, 25), {
        // 指定定位位置。   
        // 当标注显示在地图上时，其所指向的地理位置距离图标左上    
        // 角各偏移10像素和25像素。您可以看到在本例中该位置即是   
        // 图标中央下端的尖角位置。    
        anchor: new BMap.Size(10, 25),
        // 设置图片偏移。   
        // 当您需要从一幅较大的图片中截取某部分作为标注图标时，您   
        // 需要指定大图的偏移位置，此做法与css sprites技术类似。    
        imageOffset: new BMap.Size(0, 0 - index * 25)   // 设置图片偏移    
      });
      // 创建标注对象并添加到地图   
      var marker = new BMap.Marker(point, { icon: myIcon });
      map.addOverlay(marker);
    }

    console.log(this.altitude);
    
    var text: string = this.latitude + ',' + this.longitude + ',' + this.altitude;
    // this.base.logger(text, "about_ionViewDidEnter.txt");

    if (Number(this.altitude)!=-10000 && this.altitude!="" && this.altitude) {
      clearInterval(a);
      setTimeout(() => {
        point = this.coordinateConvertor.wgs2bd(Number(this.latitude), Number(this.longitude));
        console.log("Point1进来");
        console.log(point);

        var point2 = new BMap.Point(point[1], point[0]);
        // var point2 = new BMap.Point(119.24242762534455, 26.085565172849666);
        console.log("进来的");
        console.log(point2);


        var mk = new BMap.Marker(point2);
        map.addOverlay(mk);
        map.panTo(point2);
        console.log(point2);
        // this.base.showAlert("提示",point2.lat.toString() + point2.lng.toString(),()=>{});
        // alert('您的位置：' + r.point.lng + ',' + r.point.lat);



        map.centerAndZoom(point2, 15);  // 编写自定义函数，创建标注   


        addMarker(point2, 0);


       

      }, 1000)

    }
    // if (this.altitude != '-10000' && !this.altitude && this.altitude != "") {


  }

  addMarker() {
    var options = {

      size: 15,

      shape: 2,

      color: '#d340c3'

    }

    var markerClusterer = new BMap.PointCollection(markers,options);
    // var marker = new BMap.Marker(point);
    this.map.addOverlay(markerClusterer);
  }

}
