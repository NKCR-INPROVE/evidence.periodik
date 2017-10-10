package cz.incad.k5journals.searchapp;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;

public class RESTHelper {

    public static InputStream inputStream(String urlString) throws IOException {
        URLConnection uc = openConnection(urlString);
        HttpURLConnection hcon = (HttpURLConnection) uc;
        hcon.setInstanceFollowRedirects(true);
        HttpURLConnection.setFollowRedirects(true);
        return uc.getInputStream();
    }

    public static URLConnection openConnection(String urlString) throws MalformedURLException, IOException {
        URL url = new URL(urlString);
        URLConnection uc = url.openConnection();
        HttpURLConnection hcon = (HttpURLConnection) uc;
        hcon.setInstanceFollowRedirects(true);
        HttpURLConnection.setFollowRedirects(true);
        uc.setReadTimeout(Integer.parseInt("100000"));
        uc.setConnectTimeout(Integer.parseInt("10000"));
        return uc;
    }
    
    

    public static InputStream inputStream(String urlString, Map<String, String> reqProps) throws IOException {
        URLConnection uc = openConnection(urlString, reqProps);
        HttpURLConnection hcon = (HttpURLConnection) uc;
        hcon.setInstanceFollowRedirects(true);
        HttpURLConnection.setFollowRedirects(true);
        return uc.getInputStream();
    }

    public static URLConnection openConnection(String urlString, Map<String, String> reqProps) throws MalformedURLException, IOException {
        URL url = new URL(urlString);
        URLConnection uc = url.openConnection();
        HttpURLConnection hcon = (HttpURLConnection) uc;
        hcon.setInstanceFollowRedirects(true);
        HttpURLConnection.setFollowRedirects(true);
        uc.setReadTimeout(Integer.parseInt("100000"));
        uc.setConnectTimeout(Integer.parseInt("10000"));
        for (Map.Entry<String, String> entry : reqProps.entrySet()) {
            uc.setRequestProperty(entry.getKey(), entry.getValue());
        }
        
        return uc;
    }

    public static InputStream inputStream(String urlString, String user, String pass) throws IOException {
        URLConnection uc = openConnection(urlString, user, pass);
        return uc.getInputStream();
    }

    public static URLConnection openConnection(String urlString, String user,
            String pass) throws MalformedURLException, IOException {
        URL url = new URL(urlString);
        URLConnection uc = url.openConnection();
        uc.setReadTimeout(Integer.parseInt("100000"));
        uc.setConnectTimeout(Integer.parseInt("10000"));
        String userPassword = user + ":" + pass;
        String encoded = Base64.encodeBase64String(userPassword.getBytes());
        uc.setRequestProperty("Authorization", "Basic " + encoded);
        return uc;
    }

}
