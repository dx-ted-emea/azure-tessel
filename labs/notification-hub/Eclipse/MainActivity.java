package com.example.notificationhubsample;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.os.AsyncTask;    
import com.google.android.gms.gcm.*;
import com.microsoft.windowsazure.messaging.*;
import com.microsoft.windowsazure.notifications.NotificationsManager;


public class MainActivity extends ActionBarActivity {
	
	private String SENDER_ID = "<Your-Google-Project-Number>";
	private GoogleCloudMessaging gcm;
	private NotificationHub hub;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        
        
        NotificationsManager.handleNotifications(this, SENDER_ID, MyHandler.class);

        gcm = GoogleCloudMessaging.getInstance(this);

        String connectionString = "<Your-NotificationHub-ConnectionString>";
        hub = new NotificationHub("<Your-Hub-Name>", connectionString, this);

        registerWithNotificationHubs();
        
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {

        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        if (id == R.id.action_settings) {
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
    
    @SuppressWarnings("unchecked")
    private void registerWithNotificationHubs() {
       new AsyncTask() {
          @Override
          protected Object doInBackground(Object... params) {
             try {
                String regid = gcm.register(SENDER_ID);
                hub.register(regid);
             } catch (Exception e) {
                return e;
             }
             return null;
         }
       }.execute(null, null, null);
    }
}
