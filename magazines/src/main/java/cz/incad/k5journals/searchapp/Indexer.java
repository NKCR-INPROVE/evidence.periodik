package cz.incad.k5journals.searchapp;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.UnsupportedCharsetException;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.io.FileUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.solr.client.solrj.SolrClient;
import org.apache.solr.client.solrj.impl.HttpSolrClient;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
public class Indexer {

  static final Logger LOGGER = Logger.getLogger(Indexer.class.getName());
  Options opts;
  JSONObject langsMap;

  SolrClient client;
  int total;
  JSONObject ret;

  Map<String, Integer> dates = new HashMap();

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
    SolrClient client = new HttpSolrClient.Builder(String.format("%s%s",
            opts.getString("solr.host", "http://localhost:8983/solr/"),
            core)).build();
    return client;
  }

  /**
   * Index doc only
   *
   * @param f File to index
   * @param index doc index in parent children
   */
  public JSONObject indexFile(File f, String core) {
    ret = new JSONObject();
    try {
      ret = indexJson(FileUtils.readFileToString(f, "UTF-8"), core);
    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      ret.put("error", ex);
    }
    return ret;

  }

  /**
   * Index doc and his children recursively. First find idx from parent
   *
   * @param jo string
   * @return JSONObject with index info
   */
  public JSONObject indexJson(String jo, String core) {

      LOGGER.log(Level.INFO, jo);
    ret = new JSONObject();

    try {
      String url = opts.getString("solr.host", "http://localhost:8983/solr/")
              + core + "/update/json/docs?commit=true";

      CloseableHttpClient client = HttpClients.createDefault();
      HttpPost post = new HttpPost(url);
      post.setHeader("Accept", "application/json");
      post.setHeader("Content-type", "application/json");

      post.setEntity(new StringEntity(jo, "UTF-8"));

      HttpResponse response = client.execute(post);
      LOGGER.log(Level.INFO, "Sending 'POST' request to URL : " + url);
      LOGGER.log(Level.INFO, "Post parameters : " + post.getEntity());
      LOGGER.log(Level.INFO, "Response Code : "
              + response.getStatusLine().getStatusCode());

      BufferedReader rd = new BufferedReader(
              new InputStreamReader(response.getEntity().getContent()));

      StringBuilder result = new StringBuilder();
      String line = "";
      while ((line = rd.readLine()) != null) {
        result.append(line);
      }

      //print result
      LOGGER.log(Level.INFO, result.toString());
      ret = new JSONObject(result.toString());

    } catch (IOException | UnsupportedOperationException | UnsupportedCharsetException | JSONException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
      ret.put("error", ex);
    }

    LOGGER.log(Level.INFO, "index finished. Indexed: {0}", total);


    return ret;
  }

}
