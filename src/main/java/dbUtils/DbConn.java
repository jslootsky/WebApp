package dbUtils;

import java.sql.DriverManager;
import java.sql.Connection;
import java.io.InputStream; //added to read file config
import java.util.Properties; //for reading key-value pairs from files

// Wrapper class for database connection. Constructor opens connection. Close
// method closes connection.
public class DbConn {

    private String errMsg = ""; // will remain "" unless error getting connection
    private java.sql.Connection conn = null;
    private Properties properties = new Properties();

    public DbConn() {

        //loading credentials from a file rather than hardcoding them into the source code
        loadProperties();
        String hostname = properties.getProperty("hostname", "localhost");
        String port = properties.getProperty("port", "3307");
        String database = properties.getProperty("database", "");
        String username = properties.getProperty("username", "");
        String password = properties.getProperty("password", "");

        try {
            String DRIVER = "com.mysql.cj.jdbc.Driver";
            Class.forName(DRIVER);
            try {
                // Assume you are running from home using tunneling...
                String url = "jdbc:mysql://" + hostname + ":" + port + "/" + database + "?user=" + username + "&password=" + password;

                // unless you are working from temple (e.g., lab computer or published)
                if (this.isTemple()) {
                    url = "jdbc:mysql://cis-linux2.temple.edu:3306/" + database + "?user=" + username + "&password=" + password;
                }
                this.conn = DriverManager.getConnection(url);

            } catch (Exception e) { // cant get the connection
                recordError("Problem getting connection:" + e.getMessage());
            }
        } catch (Exception e) { // cant get the driver...
            recordError("Problem getting driver:" + e.getMessage());
        }
    } // method

    //method to locate and open dbconfig.properties from the classpath, where credentials are stored
    private void loadProperties(){
        try(InputStream input = getClass().getClassLoader().getResourceAsStream("dbconfig.properties")) {
            if (input == null) {
                recordError("Properties file not found in classpath.");
                return;
            }
            properties.load(input);
            //properties.forEach((key, value) -> System.out.println(key + ": " + value));
        }catch(Exception e){
            recordError("Problem loading properties file: " + e.getMessage());
        }
    }

    private void recordError(String errorMsg) {
        this.errMsg = errorMsg;
        System.out.println("Error in DbConn. " + errorMsg);
    }

    /* Returns database connection for use in SQL classes. */
    public Connection getConn() {
        return this.conn;
    }

    /* Returns database connection error message or "" if there is none. */

    //adding "user friendly" error message
    //Database unavailable - please try later or contact your administrator. 

    //Message for administrator
    //Error: [technical message from the DBMS]. 
    public String getErr() {
        return "Database unavailable - please try later or contact your administrator.\n" 
        +"Error: "+ this.errMsg;
    }

    /**
     * Close database connection.
     */
    public void close() {

        if (conn != null) {
            try {
                conn.close();
            } // try
            catch (Exception e) {
                // Don't care if connection was already closed. Do nothing.
            } // catch
        } // if
    } // method

    /**
     * Checks the hostname to see if web app is running at Temple or not.
     */
    private boolean isTemple() {
        boolean temple = false;
        try {
            String hostName = java.net.InetAddress.getLocalHost().getCanonicalHostName();
            hostName = hostName.toLowerCase();
            System.out.println("***** hostName is [" + hostName + "] *****");
            if (hostName.endsWith("temple.edu")) {
                temple = true;
            }
        } catch (Exception e) {
            recordError("Unable to get hostName: " + e.getMessage());
        }
        return temple;
    }

    // This method gets run when GC (garbage collection) runs
    // and we are never sure when this might happen, but still it's better than
    // nothing to try to be sure that all db connections are closed when
    // the dbConn object is no longer referenced. Maybe we can get the IT
    // Administrator to set the GC to run more often.
    protected void finalize() {
        this.close(); //
    }

} // class
