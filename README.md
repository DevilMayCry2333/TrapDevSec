# TrapAndroidFrontEnd
TrapAndroidFrontEnd

npm install<br/>
ionic cordova platform add android <br/>

win10要在src目录下加入index.d.ts,内容为
declare module 'googlemaps';

cordova plugin add cordova-android-support-gradle-release --save(可选，先跳过这步，若后面不行再来) <br/>
ionic cordova build android 

