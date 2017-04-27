package cz.incad.k5journals.searchapp;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.apache.solr.common.SolrInputDocument;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;

/**
 *
 * @author alberto
 */
public class Indexer {

  static final Logger LOGGER = Logger.getLogger(Indexer.class.getName());
  Options opts;
  JSONObject langsMap;
  
  SolrClient client;

  public Indexer() {
    try {
      opts = Options.getInstance();
      langsMap = opts.getJSONObject("langsMap");
      client = getClient("journal");
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
    } catch (JSONException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
    }
  }
  
  private SolrClient getClient(String core) throws IOException {
        SolrClient client = new HttpSolrClient.Builder(String.format("%s/%s",
                opts.getString("solr.host", "http://localhost:8983"),
                core)).build();
        //server.setMaxRetries(1); // defaults to 0.  > 1 not recommended.
//        client.setConnectionTimeout(5000); // 5 seconds to establish TCP
//
//        // The following settings are provided here for completeness.
//        // They will not normally be required, and should only be used 
//        // after consulting javadocs to know whether they are truly required.
//        client.setSoTimeout(30000);  // socket read timeout
//        client.setDefaultMaxConnectionsPerHost(100);
//        client.setMaxTotalConnections(100);
//        client.setFollowRedirects(false);  // defaults to false
//
//        // allowCompression defaults to false.
//        // Server side must support gzip or deflate for this to have any effect.
//        client.setAllowCompression(true);
        return client;
    }

  /**
   * Index doc only
   *
   * @param pid
   */
  public void indexPid(String pid) {
      SolrInputDocument idoc = new SolrInputDocument();
      JSONObject mods = new JSONObject();
    try {
      idoc.addField("pid", pid);
      mods = getModsToJson(pid).getJSONObject("mods:modsCollection").getJSONObject("mods:mods");
      idoc.addField("mods", mods.toString());
      JSONObject item = getItem(pid);
      idoc.addField("datanode", item.optBoolean("datanode"));
      idoc.addField("model", item.optBoolean("model"));
      idoc.addField("root_title", item.optString("root_title"));
      
      JSONArray ctx = item.getJSONArray("context");
      for(int i = 0; i<ctx.length(); i++){
        String model_path = "";
        JSONArray ja = ctx.getJSONArray(i);
        idoc.addField("parents", ja.getJSONObject(ja.length() - 1).getString("pid"));
        for(int j = 0; j<ja.length(); j++){
          model_path += ja.getJSONObject(j).getString("model") + "/";
        }
        idoc.addField("model_paths", model_path);
      }
      
      
      if(item.has("pdf")){
        idoc.addField("url_pdf", item.getJSONObject("pdf").getString("url"));
      }
      
      setTitleInfo(idoc, mods);
      //LOGGER.log(Level.INFO, "idoc: {0}", idoc);
      client.add(idoc);
      client.commit();
    } catch (SolrServerException | IOException ex) {
      LOGGER.log(Level.SEVERE, "mods: {0}", mods);
      LOGGER.log(Level.SEVERE, "idoc: {0}", idoc);
      LOGGER.log(Level.SEVERE, null, ex);
    }

  }

  /**
   * Index doc and his children recursively
   *
   * @param pid
   */
  private void indexPidAndChildren(String pid) {
    indexPid(pid);
    JSONArray children = getChildren(pid);
    for(int i = 0; i<children.length(); i++){
      indexPid(children.getJSONObject(i).getString("pid"));
    }

  }

  /**
   * Retrieve and converts BIBLIO_MODS to JSON Object
   *
   * @param pid
   * @return JSON representation of xml
   */
  public JSONObject getModsToJson(String pid) {
    try {

      String k5host = opts.getString("api.point", "http://localhost:8080/search/api/v5.0")
              + "/item/" + pid + "/streams/BIBLIO_MODS";
      Map<String, String> reqProps = new HashMap<>();
      reqProps.put("Content-Type", "application/json");
      reqProps.put("Accept", "application/json");
      InputStream inputStream = RESTHelper.inputStream(k5host, reqProps);
      String modsXml = org.apache.commons.io.IOUtils.toString(inputStream, Charset.forName("UTF-8"));
      return XML.toJSONObject(modsXml);
    } catch (JSONException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return null;
    }
  }
  
  private JSONObject getItem(String pid) {
    try {

      String k5host = opts.getString("api.point", "http://localhost:8080/search/api/v5.0")
              + "/item/" + pid;
      Map<String, String> reqProps = new HashMap<>();
      reqProps.put("Content-Type", "application/json");
      reqProps.put("Accept", "application/json");
      InputStream inputStream = RESTHelper.inputStream(k5host, reqProps);
      return new JSONObject(org.apache.commons.io.IOUtils.toString(inputStream, Charset.forName("UTF-8")));
    } catch (JSONException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return null;
    }
  }
  
  private JSONArray getStreams(String pid) {
    try {

      String k5host = opts.getString("api.point", "http://localhost:8080/search/api/v5.0")
              + "/item/" + pid + "/streams";
      Map<String, String> reqProps = new HashMap<>();
      reqProps.put("Content-Type", "application/json");
      reqProps.put("Accept", "application/json");
      InputStream inputStream = RESTHelper.inputStream(k5host, reqProps);
      return new JSONArray(org.apache.commons.io.IOUtils.toString(inputStream, Charset.forName("UTF-8")));
    } catch (JSONException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return null;
    }
  }
  
  private JSONArray getChildren(String pid) {
    try {

      String k5host = opts.getString("api.point", "http://localhost:8080/search/api/v5.0")
              + "/item/" + pid + "/children";
      Map<String, String> reqProps = new HashMap<>();
      reqProps.put("Content-Type", "application/json");
      reqProps.put("Accept", "application/json");
      InputStream inputStream = RESTHelper.inputStream(k5host, reqProps);
      return new JSONArray(org.apache.commons.io.IOUtils.toString(inputStream, Charset.forName("UTF-8")));
    } catch (JSONException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      return null;
    }
  }

  private void setTitleInfo(SolrInputDocument idoc, JSONObject mods) {

    Object o = mods.get("mods:titleInfo");
    if (o instanceof JSONObject) {
      JSONObject jo = (JSONObject) o;
      idoc.addField("title", jo.optString("mods:title"));
      idoc.addField("subtitle", jo.optString("mods:subTitle"));
      idoc.addField("non_sort_title", jo.optString("mods:nonSort"));

    } else if (o instanceof JSONArray) {
      JSONArray ja = (JSONArray) o;
      boolean hasDefault = false;
      for (int i = 0; i < ja.length(); i++) {
        JSONObject jo = ja.getJSONObject(i);
        if(jo.has("lang")){
          String lang = jo.optString("lang");
          idoc.addField("title_" + lang, jo.optString("mods:title"));
          idoc.addField("subtitle_" + lang, jo.optString("mods:subTitle"));
          idoc.addField("non_sort_title_" + lang, jo.optString("mods:nonSort"));
        } else {
          idoc.addField("title", jo.optString("mods:title"));
          idoc.addField("subtitle", jo.optString("mods:subTitle"));
          idoc.addField("non_sort_title", jo.optString("mods:nonSort"));
          hasDefault = true;
        }
      }
      if(!hasDefault){
          JSONObject jo = ja.getJSONObject(0);
          idoc.addField("title", jo.optString("mods:title"));
          idoc.addField("subtitle", jo.optString("mods:subTitle"));
          idoc.addField("non_sort_title", jo.optString("mods:nonSort"));
      }
    }

  }
}
