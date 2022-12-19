import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { getEnvPath } from "./env.helper";

require("dotenv").config({
  path: getEnvPath(__dirname + "/common/envs")
});

export const reportErrorSlack = async (error: any, exception: boolean = true, functionName: string = "", params = null) => {
  if (process.env.NODE_ENV?.toUpperCase() != "DEVELOPMENT") {
    let messageBody = null;
    if (exception) {
      messageBody = {
        "username"   : "GAP Exception", // This will appear as user name who posts the message
        "text"       : "Hands Up.! We found a new issue in GAP Backend", // text
        "icon_emoji" : ":boom:", // User icon, you can also use custom icons here
        "attachments": [{ // this defines the attachment block, allows for better layout usage
          "color" : "#FF0000", // color of the attachments sidebar.
          "fields": [ // actual fields
            {
              "title": "Environment", // Custom field
              "value": process.env.NODE_ENV || "Development", // Custom value
              "short": true // long fields will be full width
            },
            {
              "title": "Platform",
              "value": "Backend",
              "short": true
            },
            {
              "title": "Type",
              "value": error.name,
              "short": true
            },
            {
              "title": "Function",
              "value": functionName,
              "short": true
            },
            {
              "title": "Message",
              "value": `${error.message}`,
              "short": true
            },
            {
              "title": "Summary",
              "value": error.stack || "Not Getting",
              "short": false
            },
            {
              "title": "Params",
              "value": `${JSON.stringify(params)}`,
              "short": false
            }
          ]
        }]
      };
      sendTOSlack(messageBody).then();
    }
  }
  return true;
};

export const sendTOSlack = async (messageBody) => {
  const https      = require("https");
  const webhookURL = process.env.SLACK_WEB_HOOK;
  // make sure the incoming message body can be parsed into valid JSON
  try {
    messageBody = JSON.stringify(messageBody);
  } catch (e) {
    throw new Error("Failed to stringify messageBody");
  }

  // Promisify the https.request
  return new Promise((resolve, reject) => {
    // general request options, we defined that it's a POST request and content is JSON
    const requestOptions = {
      method: "POST",
      header: {
        "Content-Type": "application/json"
      }
    };

    // actual request
    const req = https.request(webhookURL, requestOptions, (res) => {
      let response = "";
      res.on("data", (d) => {
        response += d;
      });

      // response finished, resolve the promise with data
      res.on("end", () => {
        resolve(response);
      });
    });

    // there was an error, reject the promise
    req.on("error", (e) => {
      reject(e);
    });

    // send our message body (was parsed to JSON beforehand)
    req.write(messageBody);
    req.end();
  });
};

export const comparePwd = (oldPwd, newPwd) => {
  return bcrypt.compareSync(newPwd, oldPwd) || false;
};

export const generateToken = async (obj) => {
  const {
          user_id,
          device_id,
          role_id
        } = obj;
  return jwt.sign(
    {
      user_id,
      ...(device_id && { aud: device_id }),
      ...(role_id && { role_id })
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY + "d" }
  );
};

export const generatePwd = (password) => {
  return bcrypt.hashSync(password, 10);
};
