import Parse from "parse/dist/parse.min.js";

// Initialize Parse
// Parse.initialize("myAppId", "myJavascriptKey"); // Replace with your keys
// Parse.serverURL = "http://localhost:1337/parse"; // Replace with your Parse Server URL

Parse.initialize("myApp123", "myJavascriptKey");
Parse.serverURL = "https://parse-ucig.onrender.com/parse";
export default Parse;
