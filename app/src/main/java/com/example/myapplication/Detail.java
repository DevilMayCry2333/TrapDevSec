package com.example.myapplication;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.widget.ListView;
import android.widget.Toast;
import com.example.myapplication.R;

import java.util.ArrayList;
import java.util.HashMap;

public class Detail extends AppCompatActivity {
    private ArrayList<HashMap<String,String>> detailArray;
    private ListView locationArray;
    private DetailAdapter detailAdapter;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_detail);


        ActivityCompat.requestPermissions(this, new String[] {
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION },
                1);

        detailArray = new ArrayList<>();

//        Log.i("arraySize:",String.valueOf(detailArray.size()));
        locationArray = (ListView) findViewById(R.id.locationArray);
        detailAdapter = new DetailAdapter(this,detailArray);
        locationArray.setAdapter(detailAdapter);

//        Log.i("getCount:",String.valueOf(detailAdapter.getCount()));
        getLocation();
    }

    public void showLocation(Location currentLocation,boolean isGps,boolean isNetwork){
        if(currentLocation != null){
            HashMap<String,String> info = new HashMap<>();
            info.put("longtitude",String.valueOf(currentLocation.getLongitude()));
            info.put("latitude",String.valueOf(currentLocation.getLatitude()));
            info.put("accuracy",String.valueOf(currentLocation.getAccuracy()));
            info.put("isGps",String.valueOf(isGps));
            info.put("isNet",String.valueOf(isNetwork));
            detailArray.add(info);
            detailAdapter.notifyDataSetChanged();

            Log.e("detailLength",String.valueOf(detailArray.size()));
            String s = "";
            s += " Current Location: (";
            s += currentLocation.getLongitude();
            s += ",";
            s += currentLocation.getLatitude();
            s += ")\n Speed: ";
            s += currentLocation.getSpeed();
            s += "\n Direction: ";
            s += currentLocation.getBearing();
            s += "\n Accuracy: ";
            s += currentLocation.getAccuracy();
            Toast.makeText(this,s,Toast.LENGTH_LONG).show();
        }
        else{

        }
    }
    @SuppressLint("MissingPermission")
    public void getLocation(){
        final LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);



        final Boolean isGps = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        //通过WLAN或移动网络(3G/2G)确定的位置（也称作AGPS，辅助GPS定位。主要用于在室内或遮盖物（建筑群或茂密的深林等）密集的地方定位）
        final Boolean isNetwork = locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);

        System.out.println(isGps);
        System.out.println(isNetwork);
        @SuppressLint("MissingPermission") Location location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        showLocation(location,isGps,isNetwork);

        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 1, new LocationListener() {
            public void onLocationChanged(Location location) {
                // TODO Auto-generated method stub
                showLocation(location,isGps,isNetwork);
            }
            public void onProviderDisabled(String provider) {
                // TODO Auto-generated method stub
                showLocation(null,isGps,isNetwork);
            }
            public void onProviderEnabled(String provider) {

                showLocation(locationManager.getLastKnownLocation(provider),isGps,isNetwork);
            }
            public void onStatusChanged(String provider, int status, Bundle extras) {
                // TODO Auto-generated method stub
            }
        });

    }




}
