package cz.incad.k5journals.searchapp;


import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author Alberto Hernandez
 */
public class I18n {

  public static final Logger LOGGER = Logger.getLogger(I18n.class.getName());

  private static I18n _sharedInstance = null;
  private Map<String, JSONObject> locales;
  
  public synchronized static I18n getInstance() throws IOException, JSONException {
    if (_sharedInstance == null) {
      _sharedInstance = new I18n();
    }
    return _sharedInstance;
  }

  public synchronized static void resetInstance() {
    _sharedInstance = null;
    LOGGER.log(Level.INFO, "I18n reseted");
  }

  public I18n() throws IOException, JSONException {
    locales = new HashMap<>();
    LOGGER.log(Level.FINE, locales.toString());
  }
  public void load(String locale, String ctx) throws IOException, JSONException {
    
    String filename = locale+".json";

    File fdef = new File(InitServlet.DEFAULT_I18N_DIR + File.separator + filename);

    String json = FileUtils.readFileToString(fdef, "UTF-8");
    JSONObject def = new JSONObject(json);
    
    String path = InitServlet.CONFIG_DIR + File.separator + "i18n/"+ filename;
    
    //Merge default file defined in custom dir
    File f = new File(path);
    if (f.exists() && f.canRead()) {
      json = FileUtils.readFileToString(f, "UTF-8");
      JSONObject customClientConf = new JSONObject(json);
      Iterator keys = customClientConf.keys();
      while (keys.hasNext()) {
        String key = (String) keys.next();
        LOGGER.log(Level.FINE, "key {0} will be overrided", key);
        def.put(key, customClientConf.get(key));
      }
    }
    
    //Merge file defined in custom dir for ctx
    if(ctx != null){
      File fctx = new File(path);
      if (fctx.exists() && fctx.canRead()) {
        json = FileUtils.readFileToString(fctx, "UTF-8");
        JSONObject customClientConf = new JSONObject(json);
        Iterator keys = customClientConf.keys();
        while (keys.hasNext()) {
          String key = (String) keys.next();
          LOGGER.log(Level.FINE, "key {0} will be overrided", key);
          def.put(key, customClientConf.get(key));
        }
      }
    }
    
    locales.put(ctx+"_"+locale, def);

  }

  public JSONObject getLocale(String locale, String ctx) throws IOException {
    if(!locales.containsKey(ctx+"_"+locale)){
      load(locale, ctx);
    }
    return locales.get(ctx+"_"+locale);
  }

}
