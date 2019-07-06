import {Component, ElementRef, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import {HttpClient, HttpParams} from "@angular/common/http";
import {TabsPage} from "../tabs/tabs";
import {Base} from "../../common/base.js";
import {CoordinateConvertor} from "../../common/coordinate-convertor";
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
  constructor(public navCtrl: NavController, private httpClient: HttpClient, private base: Base,
              private coordinateConvertor: CoordinateConvertor) {

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

  myLocation(map:any){
    // let map = this.map = new BMap.Map(this.map_container2.nativeElement, { enableMapClick: true });//创建地图实例
        var geolocation = new BMap.Geolocation();
    // 开启SDK辅助定位
    geolocation.enableSDKLocation();
    geolocation.getCurrentPosition(function (r) {
      // if (this.getStatus() == BMAP_STATUS_SUCCESS) {
      var mk = new BMap.Marker(r.point);
      map.addOverlay(mk);
      map.panTo(r.point);
      // alert('您的位置：' + r.point.lng + ',' + r.point.lat);

      var point = new BMap.Point(r.point.lng, r.point.lat);
      map.centerAndZoom(point, 15);  // 编写自定义函数，创建标注   
      function addMarker(point, index) {  // 创建图标对象   
        var myIcon = new BMap.Icon("../../assets/imgs/myLocation.jpeg", new BMap.Size(23, 25), {
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
      addMarker(point, 0);

      // }
      // else {
      // }
    });
  }
  ionViewDidEnter() {
    let map = this.map = new BMap.Map(this.map_container2.nativeElement, {enableMapClick: true});//创建地图实例
    var point = new BMap.Point(116.331398, 39.897445);
    map.centerAndZoom(point, 12);
    // setInterval("this.myLocation()",5000);
    // this.myLocation();
    setInterval(() => {
      this.myLocation(map);
    }, 5000);



    map.centerAndZoom('中国', 5);

    map.addControl(new BMap.MapTypeControl());

    let sizeMap = new BMap.Size(10, 80);//显示位置
    map.addControl(new BMap.NavigationControl());


    map.enableScrollWheelZoom(true);//启动滚轮放大缩小，默认禁用
    map.enableContinuousZoom(true);//连续缩放效果，默认禁用
    this.httpClient.get('http://39.108.184.47:8081/auth_api/user', {headers: {token: localStorage['token']}})
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
          var point = this.coordinateConvertor.wgs2bd(res['data'][i].latitude, res['data'][i].longitude);
          point = new BMap.Point(point[1], point[0]);
          markers.push(point);
          // this.addMarker(point);
        }
      }
        this.addMarker()
    })


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
