const path = require('path');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const publicPath = path.join(__dirname, 'build');

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  }
  
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
