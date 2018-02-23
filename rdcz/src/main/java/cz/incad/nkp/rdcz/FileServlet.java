/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.incad.nkp.rdcz;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.Iterator;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.io.FileUtils;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 *
 * @author alberto Servlets serves files stored in configuration directory
 */
public class FileServlet extends HttpServlet {

  public static final Logger LOGGER = Logger.getLogger(FileServlet.class.getName());
  public static final String ACTION_NAME = "action";

  /**
   * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
   * methods.
   *
   * @param request servlet request
   * @param response servlet response
   * @throws ServletException if a servlet-specific error occurs
   * @throws IOException if an I/O error occurs
   */
  protected void processRequest(HttpServletRequest req, HttpServletResponse resp)
          throws ServletException, IOException {
    try {

      String actionNameParam = req.getParameter(ACTION_NAME);
      if (actionNameParam != null) {

        Actions actionToDo = Actions.valueOf(actionNameParam.toUpperCase());
        actionToDo.doPerform(req, resp);

      } else {
        PrintWriter out = resp.getWriter();
        out.print("Action missing");
      }
    } catch (IOException e1) {
      LOGGER.log(Level.SEVERE, e1.getMessage(), e1);
      resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e1.toString());
      PrintWriter out = resp.getWriter();
      out.print(e1.toString());
    } catch (SecurityException e1) {
      LOGGER.log(Level.SEVERE, e1.getMessage(), e1);
      resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
    } catch (Exception e1) {
      LOGGER.log(Level.SEVERE, e1.getMessage(), e1);
      resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      PrintWriter out = resp.getWriter();
      resp.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, e1.toString());
      out.print(e1.toString());
    }

  }

  enum Actions {
    UPLOAD {
      @Override
      void doPerform(HttpServletRequest request, HttpServletResponse resp) throws Exception {

        resp.setContentType("application/json;charset=UTF-8");

        PrintWriter out = resp.getWriter();
        JSONObject json = new JSONObject();
        try {

          String path = InitServlet.CONFIG_DIR + File.separator + "files";
          new File(path).mkdirs();
          String id = request.getParameter("id");

          boolean isMultipart = ServletFileUpload.isMultipartContent(request);

          System.out.println(isMultipart);

          // Create a factory for disk-based file items
          DiskFileItemFactory factory = new DiskFileItemFactory();

// Configure a repository (to ensure a secure temp location is used)
          ServletContext servletContext = request.getServletContext();
          File repository = (File) servletContext.getAttribute("javax.servlet.context.tempdir");
          factory.setRepository(repository);

// Create a new file upload handler
          ServletFileUpload upload = new ServletFileUpload(factory);

// Parse the request
          List<FileItem> items = upload.parseRequest(request);

          LOGGER.log(Level.INFO, "id = {0}", id);

          // Process the uploaded items
          Iterator<FileItem> iter = items.iterator();
          while (iter.hasNext()) {
            FileItem item = iter.next();
            if (item.isFormField()) {
//              String name = item.getFieldName();
//              String value = item.getString();
            } else {

              String fileName = item.getName();
              File uploadedFile = new File(path + File.separator + fileName);
              item.write(uploadedFile);

              json.put("location", "file?action=GET&id=" + fileName);
            }
          }

        } catch (Exception ex) {
          LOGGER.log(Level.SEVERE, "error during file upload. Error: {0}", ex);
          json.put("error", ex.toString());
        }
        out.println(json.toString(2));
      }
    },
    GET {
      @Override
      void doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {

        try (OutputStream out = response.getOutputStream()) {
          String id = request.getParameter("id");
          String path = InitServlet.CONFIG_DIR + File.separator + "files";
          File f = new File(path + File.separator + id);

          if (f.exists()) {

            ServletContext cntx = request.getServletContext();
            // retrieve mimeType dynamically
            String mime = cntx.getMimeType(path + File.separator + id);

            LOGGER.log(Level.INFO, "mime: {0}", mime);
            response.setContentType(mime);
            response.setContentLength((int) f.length());

            // forces download
            String headerKey = "Content-Disposition";
            String headerValue = String.format("attachment; filename=\"%s\"", f.getName());
            response.setHeader(headerKey, headerValue);

            FileUtils.copyFile(f, out);
          }
        }
      }
    },
    LIST {
      @Override
      void doPerform(HttpServletRequest request, HttpServletResponse response) throws Exception {

        response.setContentType("application/json;charset=UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject json = new JSONObject();
       try {

          String path = InitServlet.CONFIG_DIR + File.separator + "files";

          File folder = new File(path);
          if (folder.exists()) {
            json.put("files", new JSONArray());
            
            File[] listOfFiles = folder.listFiles();
            for (File file : listOfFiles) {
              if (file.isFile()) {
                json.append("files", file.getName());
              }
            }
          } else {
            json.put("files", new JSONArray());
          }

        } catch (Exception ex) {
          LOGGER.log(Level.SEVERE, "error getting file list. Error: {0}", ex);
          json.put("error", ex.toString());
        }
        out.println(json.toString(2));
      }
    };

    abstract void doPerform(HttpServletRequest req, HttpServletResponse resp) throws Exception;
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
