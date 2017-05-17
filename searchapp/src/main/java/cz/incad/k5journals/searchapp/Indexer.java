package cz.incad.k5journals.searchapp;

import cz.incad.FormatUtils;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.Charset;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
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
  int total;
  JSONObject response;

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
    return client;
  }

  /**
   * Index doc only
   *
   * @param pid document identifier 
   * @param index doc index in parent children
   */
  public void indexPid(String pid, int index) {
    SolrInputDocument idoc = new SolrInputDocument();
    JSONObject mods = new JSONObject();
    try {
      idoc.addField("pid", pid);
      mods = getModsToJson(pid).getJSONObject("mods:modsCollection").getJSONObject("mods:mods");
      idoc.addField("mods", mods.toString());
      JSONObject item = getItem(pid);
      idoc.addField("datanode", item.optBoolean("datanode"));
      idoc.addField("model", item.optString("model"));
      response.increment(item.optString("model"));
      idoc.addField("root_title", item.optString("root_title"));
      idoc.addField("idx", index);

      
      JSONArray ctx = item.getJSONArray("context");
      for (int i = 0; i < ctx.length(); i++) {
        String model_path = "";
        String pid_path = "";
        JSONArray ja = ctx.getJSONArray(i);
        if (ja.length() > 1) {
          idoc.addField("parents", ja.getJSONObject(ja.length() - 2).getString("pid"));
        }
        for (int j = 0; j < ja.length(); j++) {
          model_path += ja.getJSONObject(j).getString("model") + "/";
          pid_path += ja.getJSONObject(j).getString("pid") + "/";
        }
        idoc.addField("model_paths", model_path);
        idoc.addField("pid_paths", pid_path);
      }

      if (item.has("pdf")) {
        idoc.addField("url_pdf", item.getJSONObject("pdf").getString("url"));
        getPdf(pid, idoc);
      }

      setTitleInfo(idoc, mods);
      setGenre(idoc, mods);
      LOGGER.log(Level.INFO, "indexed: {0}", total++);
      client.add(idoc);
      client.commit();
    } catch (SolrServerException | IOException | JSONException ex) {
      LOGGER.log(Level.SEVERE, "mods: {0}", mods);
      LOGGER.log(Level.SEVERE, "idoc: {0}", idoc);
      LOGGER.log(Level.SEVERE, null, ex);
    }

  }

  /**
   * Index doc and his children recursively. First find idx from parent
   *
   * @param pid
   * @return JSONObject with index info
   */
  public JSONObject indexDeep(String pid) {
    response = new JSONObject();
    Date tstart = new Date();
    int idx = getIdx(pid);
    LOGGER.log(Level.INFO, "idx: {0}", idx);
    indexPidAndChildren(pid, idx);
    LOGGER.log(Level.INFO, "index finished. Indexed: {0}", total);

    response.put("total indexed", total);
    Date tend = new Date();
    response.put("ellapsed time", FormatUtils.formatInterval(tend.getTime() - tstart.getTime()));
    return response;
  }

  private int getIdx(String pid) {
    JSONObject item = getItem(pid);
    JSONArray ctx = item.getJSONArray("context");
    if (ctx.length() > 0) {
      JSONArray ja = ctx.getJSONArray(ctx.length() - 1);
      if (ja.length() > 1) {
        String ppid = ja.getJSONObject(ja.length() - 2).getString("pid");
        JSONArray children = getChildren(ppid);
        for (int i = 0; i < children.length(); i++) {
          if (pid.equals(children.getJSONObject(i).getString("pid"))) {
            return i;
          }
        }
        return 0;
      } else {
        return 0;
      }

    } else {
      return 0;
    }
  }

  /**
   * Index doc and his children recursively
   *
   * @param pid
   */
  private void indexPidAndChildren(String pid, int idx) {

    indexPid(pid, idx);
    JSONArray children = getChildren(pid);
    for (int i = 0; i < children.length(); i++) {
      if (!children.getJSONObject(i).optBoolean("datanode")) {
        indexPidAndChildren(children.getJSONObject(i).getString("pid"), i);
      } else {

        indexPid(children.getJSONObject(i).getString("pid"), i);
      }
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

  /**
   * Retrieve and index Pdf stream
   *
   * @param pid
   * @return JSON representation of xml
   */
  public void getPdf(String pid, SolrInputDocument idoc) {
    try {

      String k5host = opts.getString("api.point", "http://localhost:8080/search/api/v5.0")
              + "/item/" + pid + "/streams/IMG_FULL";
      Map<String, String> reqProps = new HashMap<>();
//      reqProps.put("Content-Type", "application/json");
//      reqProps.put("Accept", "application/json");
      InputStream is = RESTHelper.inputStream(k5host, reqProps);

      try (PDDocument pdfDocument = PDDocument.load(is)) {
        PDFTextStripper stripper = new PDFTextStripper();

        StringWriter writer = new StringWriter();
        stripper.writeText(pdfDocument, writer);

        String contents = writer.getBuffer().toString();
        //StringReader reader = new StringReader(contents);

        idoc.addField("ocr", contents);
      } catch (Exception e) {
        LOGGER.log(Level.SEVERE, null, e);
      }
    } catch (JSONException | IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
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

    String prefix = "mods:";
    Object o = mods.opt("mods:titleInfo");
    if (o == null) {
      prefix = "";
      o = mods.opt("titleInfo");
    }
    if (o instanceof JSONObject) {
      JSONObject jo = (JSONObject) o;
      idoc.addField("title", jo.optString(prefix + "title"));
      idoc.addField("subtitle", jo.optString(prefix + "subTitle"));
      idoc.addField("non_sort_title", jo.optString(prefix + "nonSort"));

    } else if (o instanceof JSONArray) {
      JSONArray ja = (JSONArray) o;
      boolean hasDefault = false;
      for (int i = 0; i < ja.length(); i++) {
        JSONObject jo = ja.getJSONObject(i);
        if (jo.has("lang")) {
          String lang = jo.optString("lang");
          idoc.addField("title_" + lang, jo.optString(prefix + "title"));
          idoc.addField("subtitle_" + lang, jo.optString(prefix + "subTitle"));
          idoc.addField("non_sort_title_" + lang, jo.optString(prefix + "nonSort"));
        } else {
          if (!hasDefault) {
            idoc.addField("title", jo.optString(prefix + "title"));
            idoc.addField("subtitle", jo.optString(prefix + "subTitle"));
            idoc.addField("non_sort_title", jo.optString(prefix + "nonSort"));
            hasDefault = true;
          }
        }
      }
      if (!hasDefault) {
        JSONObject jo = ja.getJSONObject(0);
        idoc.addField("title", jo.optString(prefix + "title"));
        idoc.addField("subtitle", jo.optString(prefix + "subTitle"));
        idoc.addField("non_sort_title", jo.optString(prefix + "nonSort"));
      }
    }

  }

  private void setGenre(SolrInputDocument idoc, JSONObject mods) {

    String prefix = "mods:";
    Object o = mods.opt("mods:genre");
    if (o != null) {
      if (o instanceof JSONArray) {
        JSONArray ja = (JSONArray) o;
        for (int i = 0; i < ja.length(); i++) {
          String g = ja.getJSONObject(i).optString("type");
          if (g != null) {
            idoc.addField("genre", g);
          }
        }

      } else if (o instanceof JSONObject) {
        String g = ((JSONObject) o).optString("type");
        if (g != null) {
          idoc.addField("genre", g);
        }
      }
    }
  }
}
