import express from "express";
import i18n, { I18n } from "i18n";
import xml from "xml";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const locale = new I18n({
    locales: ["en", "ne"], // you can add language code of your choice
    fallbacks: "en", // if the locale is not supported respond with en as default
    directory: path.join(path.join(fileURLToPath(import.meta.url), ".."), "locale") // a directory where the json of locale are saved
});

// using app level middleware to initalize the locale
app.use(locale.init);


app.get("/", (req, res) => {
    res
        .status(200)
        .send(res.__("helloWorld")); // this will send the response in the request locale 
})

app.get("/message", (req, res) => {
    const accept = req.headers.accept;
    if (accept === "application/xml") {
        const xmlData = xml({
            response: [
                { message: res.__("message") }
            ]
        })
        res
            .status(200)
            .setHeader("Content-Type", "application/xml")
            .send(xmlData)

    }
    else {
        res
            .status(200)
            .setHeader("Content-Type", "application/json")
            .json({
                "message": req.__("message")
            })

    }
})


app.listen(4501, () => {
    console.log("Server is up and running at Port 4501!");
})