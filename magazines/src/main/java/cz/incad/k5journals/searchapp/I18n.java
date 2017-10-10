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
    LOGGER.log(Level.INFO, "Options reseted");
  }

  public I18n() throws IOException, JSONException {
    locales = new HashMap<>();
    LOGGER.log(Level.INFO, locales.toString());
  }
  public void load(String locale) throws IOException, JSONException {
    
    String filename = locale+".json";

    File fdef = new File(InitServlet.DEFAULT_I18N_DIR + File.separator + filename);

    String json = FileUtils.readFileToString(fdef, "UTF-8");
    JSONObject def = new JSONObject(json);
    
    String path = InitServlet.CONFIG_DIR + File.separator + "i18n/"+ filename;
    
    //Merge file defined in custom dir
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
    
    locales.put(locale, def);

  }

  public JSONObject getLocale(String locale) throws IOException {
    if(!locales.containsKey(locale)){
      load(locale);
    }
    return locales.get(locale);
  }

}
