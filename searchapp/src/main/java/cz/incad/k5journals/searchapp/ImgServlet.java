/*
 * Copyright (C) 2013 alberto
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA.
 */
package cz.incad.k5journals.searchapp;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *
 * @author alberto
 */
public class ImgServlet extends HttpServlet {

  public static final Logger LOGGER = Logger.getLogger(Options.class.getName());

  /**
   * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
   * methods.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  protected void processRequest(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    try {

      if (request.getParameter("obalka") != null) {
        
        String ctx = request.getParameter("ctx");
        String path = InitServlet.CONFIG_DIR + File.separator + ctx + File.separator + "cover.jpeg";
        File f = new File(path);
        if (f.exists()) {
          try (OutputStream out = response.getOutputStream()) {
            //response.setContentType("image/jpeg");
            BufferedImage bi = ImageIO.read(f);
            ImageIO.write(bi, "jpg", out);
          }
        } else {
          getFromUrl(request, response);
        }
      } else {

        getFromUrl(request, response);
      }

    } catch (IOException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
    } catch (JSONException ex) {
      LOGGER.log(Level.SEVERE, null, ex);
    }
  }

  private void getFromUrl(HttpServletRequest request, HttpServletResponse response) throws IOException {
    //response.addHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    response.addHeader("Access-Control-Allow-Methods", "GET, POST");
    response.addHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    Options opts = Options.getInstance();

    String solrhost = opts.getString("img.point", "http://localhost:8080/search/img");
    //        + request.getPathInfo();
    if (request.getQueryString() != null && !request.getQueryString().equals("")) {
      solrhost += "?" + request.getQueryString();
    }

    
    LOGGER.log(Level.INFO, "requesting url {0}", solrhost);
    Map<String, String> reqProps = new HashMap<>();
//    reqProps.put("Content-Type", "application/json");
//    reqProps.put("Accept", "application/json");
    InputStream inputStream = RESTHelper.inputStream(solrhost, reqProps);
    org.apache.commons.io.IOUtils.copy(inputStream, response.getOutputStream());
    //out.print(org.apache.commons.io.IOUtils.toString(inputStream, "UTF8"));
  
}

// <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
/**
 * Handles the HTTP <code>GET</code> method.
 *
 * @param request servlet request
 * @param response servlet response
 * @throws ServletException if a servlet-specific error occurs
 * @throws IOException if an I/O error occurs
 */
@Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    processRequest(request, response);
  }

  /**
   * Handles the HTTP <code>POST</code> method.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  @Override
        protected void doPost(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    processRequest(request, response);
  }

  /**
   * Returns a short description of the servlet.
   *
   * @return a String containing servlet description
   */
  @Override
        public String getServletInfo() {
    return "Short description";
  }// </editor-fold>

}
