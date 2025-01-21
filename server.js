const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "checkout.html"));
});

app.get("/pay/:method", (req, res) => {
    const { method } = req.params;
    const { amount, name, whatsapp, package } = req.query;

    // Save user data to numbers.txt
    const data = `Name: ${name}, WhatsApp: ${whatsapp}, Package: ${package}, Amount: ₹${amount}\n`;
    fs.appendFileSync("numbers.txt", data);

    // Generate payment deep link
    let paymentLink = "";
    if (method === "paytm") {
        paymentLink = `paytmmp://pay?pa=amazon-india@yesbank&pn=NumbersCo&am=${amount}&cu=INR&tn=Payment for ${encodeURIComponent(package)}`;
    } else if (method === "phonepe") {
        paymentLink = `phonepe://pay?pa=amazon-india@yesbank&pn=NumbersCo&am=${amount}&cu=INR&tn=Payment for ${encodeURIComponent(package)}`;
    } else if (method === "gpay") {
        paymentLink = `upi://pay?pa=amazon-india@yesbank&pn=Nishant&am=${amount}&cu=INR&tn=Payment for ${encodeURIComponent(package)}`;
    }

    res.redirect(paymentLink);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
