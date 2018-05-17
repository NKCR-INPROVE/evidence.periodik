/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cz.incad.k5journals.searchapp;

import io.bit3.jsass.CompilationException;
import io.bit3.jsass.Compiler;
import io.bit3.jsass.Output;
import io.bit3.jsass.importer.Import;
import java.io.FileNotFoundException;

import java.io.IOException;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;

/**
 *
 * @author alberto.a.hernandez
 */
public class JsassServlet extends HttpServlet {

  public static final Logger LOGGER = Logger.getLogger(JsassServlet.class.getName());
  private io.bit3.jsass.Options jsassOptions;
  final String scssDir = "/assets/sass/";

  @Override
  public void init() throws ServletException {
    jsassOptions = new io.bit3.jsass.Options();
    jsassOptions.setImporters(Collections.singleton(this::doImport));
  }

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
    response.setContentType("text/html;charset=UTF-8");
    deliverScss(request, response);
  }

  private boolean deliverScss(
          final HttpServletRequest request,
          final HttpServletResponse response
  ) throws ServletException, IOException {
    try {
      final String scssPath = "_app.scss";
      
      
      String color = request.getParameter("color");
      if(color == null){
        color = "AFAB25";
      }

      String brand = "$brand: #"+color+" !default; ";
//      jsassOptions.getIncludePaths().add(new File("bower_components/foundation/scss");

      final URL scssResource = getServletContext().getResource(scssPath);

      if (null != scssResource) {
        final String scssCode = brand + "\n" + IOUtils.toString(scssResource, StandardCharsets.UTF_8);

        final Compiler compiler = new Compiler();
//        final Output output = compiler.compileString(
//                scssCode,
//                jsassOptions
//        );
        final Output output = compiler.compileString(
                scssCode,
                new URI("/"),
                new URI(request.getRequestURI()),
                jsassOptions
        );
//        final Output output = compiler.compileString(
//                brand,
//                new URI("/"),
//                new URI(request.getRequestURI()),
//                jsassOptions
//        );

        response.setContentType("text/css");
        response.getWriter().write(output.getCss());
        return true;
      }

      return false;
    } catch (CompilationException | MalformedURLException | URISyntaxException e) {
      throw new ServletException(e);
    }
  }

  /**
   * Resolve the target file for an {@code @import} directive.
   *
   * @param url The {@code import} url.
   * @param previous The file that contains the {@code import} directive.
   * @return The resolve import objects or {@code null} if the import file was
   * not found.
   */
  private Collection<Import> doImport(String url, Import previous) {
    try {
      LOGGER.info("importing " + url);
      LOGGER.info("previous.getAbsoluteUri() " + previous.getAbsoluteUri().getPath());
      //LOGGER.info("previous getImportUri  " + previous.getImportUri());

      if (url.startsWith("/")) {
        Path path = Paths.get(scssDir).resolve(url);
        //LOGGER.info("path " + path.toString());
        // absolute imports are searched in /WEB-INF/scss
        return resolveImport(Paths.get(scssDir).resolve(url));
      }

      // find in import paths
      final List<Path> importPaths = new LinkedList<>();

      // (a) relative to the previous import file
      if (previous.getImportUri().toString().equals("/")) {
        return resolveImport(Paths.get("/").resolve(url));
      } else {
        final String previousPath = previous.getAbsoluteUri().getPath().substring(1);
        LOGGER.info("previousPath " + previousPath.toString());
        try {
          LOGGER.info("resolve " + Paths.get(previousPath).toString());
        } catch (InvalidPathException ee) {
          LOGGER.log(Level.SEVERE, null, ee);
        }
        final Path previousParentPath = Paths.get(previousPath).getParent();
        LOGGER.info("previousParentPath " + previousParentPath);
        final Path resolved = previousParentPath.resolve(url);
        LOGGER.info("1111 " + resolved);

        Path kk = Paths.get("/").resolve(
                Paths.get(getServletContext().getResource("/").toURI()).relativize(resolved));

        LOGGER.info("3333 " + kk);
        //LOGGER.info("2222 " + kk.relativize(resolved));
        //return resolveImport(previousParentPath.resolve(url));
        return resolveImport(kk);
        //importPaths.add(previousParentPath);
      }

      // (b) within /WEB-INF/assets/foundation
//      importPaths.add(Paths.get("/WEB-INF/assets/foundation"));
//
//      // (c) within /WEB-INF/assets/motion-ui
//      importPaths.add(Paths.get("/WEB-INF/assets/motion-ui"));
//      for (Path importPath : importPaths) {
//        LOGGER.info("importPath " + importPath);
//        Path target = importPath.resolve(url);
//
//        Collection<Import> imports = resolveImport(target);
//        if (null != imports) {
//          return imports;
//        }
//      }
      // file not found
//      throw new FileNotFoundException(url);
    } catch (URISyntaxException | IOException e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * Try to determine the import object for a given path.
   *
   * @param path The path to resolve.
   * @return The import object or {@code null} if the file was not found.
   */
  private Collection<Import> resolveImport(Path path) throws IOException, URISyntaxException {
    URL resource = resolveResource(path);
    LOGGER.info("resource: " + resource.toString());
    if (null == resource) {
      return null;
    }

    // calculate a webapp absolute URI
    String kk = Paths.get("/").resolve(
            Paths.get(getServletContext().getResource("/").toURI()).relativize(Paths.get(resource.toURI()))
    ).toString();
    LOGGER.info("kk: " + kk);
//    final URI uri = new URI(kk);
    final URI uri = resource.toURI();
    LOGGER.info("uri: " + uri.toString());
    final String source = IOUtils.toString(resource, StandardCharsets.UTF_8);

//LOGGER.info("source: " + source.toString());
    final Import scssImport = new Import(uri, uri, source);
    return Collections.singleton(scssImport);
  }

  /**
   * Try to find a resource for this path.
   *
   * <p>
   * A sass import like {@code @import "foo"} does not contain the partial
   * prefix (underscore) or file extension. This method will try the following
   * namings to find the import file {@code foo}:</p>
   * <ul>
   * <li>_foo.scss</li>
   * <li>_foo.css</li>
   * <li>_foo</li>
   * <li>foo.scss</li>
   * <li>foo.css</li>
   * <li>foo</li>
   * </ul>
   *
   * @param path The path to resolve.
   *
   * @return The resource URL of the resolved file or {@code null} if the file
   * was not found.
   */
  private URL resolveResource(Path path) throws MalformedURLException {
    final Path dir = path.getParent();
    final String basename = path.getFileName().toString();

    for (String prefix : new String[]{"_", ""}) {
      for (String suffix : new String[]{".scss", ".css", ""}) {
        final Path target = dir.resolve(prefix + basename + suffix);
        LOGGER.info("target: " + target);
        try {
          final URL resource = getServletContext().getResource(target.toString());

          LOGGER.info("resource: " + resource.toString());
          if (null != resource) {
            return resource;
          }
        } catch (Exception eee) {
          LOGGER.info("no resource" + eee.toString());
        }
      }
    }

    return null;
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
