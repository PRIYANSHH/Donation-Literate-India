const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Insta = require('instamojo-nodejs');
const keys = require(__dirname + '/keys.js');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.get("/", function (req, res) {
    res.render("index");
});
var term = 0;
app.get('/pay.html', function (req, res) {
    res.render('pay', {
        term: 0,
        message: 0

    });
});
app.post('/pay.html', function (req, res) {
    Insta.setKeys(keys.key1, keys.key2);
    const data = new Insta.PaymentData();
    Insta.isSandboxMode(true);
    data.purpose = "Donation";
    data.amount = req.body.amount;
    var amount = req.body.amount;
    data.buyer_name = req.body.name;
    var name = req.body.name;
    var name2 = name.replace(/ /g, "+");
    var amount2 = amount.replace(" ", "");
    data.email = req.body.email;
    data.phone = req.body.phone;
    data.allow_repeated_payments = false;
    data.send_email = true;
    data.send_sms = true;
    data.redirect_url = "https://evening-coast-95168.herokuapp.com/detail.html?name=" + name2 + "&amount=" + amount2;
    Insta.createPayment(data, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            const responseData = JSON.parse(response);
            console.log(responseData);
            if (responseData.success == true) {
                const redirectURL = responseData.payment_request.longurl;
                res.redirect(redirectURL);
            } else {
                term = 1;
                console.log(responseData);
                console.log(responseData.message);
                res.render('pay', {
                    term: term,
                    message: responseData.message
                });
                term = 0;
            }
        }
    });
});
app.get('/detail.html', function (req, res) {
    var payment_id = req.query.payment_id;
    var payment_status = req.query.payment_status;
    var amt = req.query.amount;
    var name4 = req.query.name;
    var name5 = name4.replace("+", " ");
    res.render("detail", {
        payment_id: payment_id,
        payment_status: payment_status,
        name: name5,
        amount: amt
    });
});
app.listen(process.env.PORT || 3000, function () {
    console.log("Server has started successfully.")
});