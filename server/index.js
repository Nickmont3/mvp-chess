const express = require('express');
const path = require('path');


let app = express();

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.json());

app.get('/board', (req, res, next) => {
  res.json('world says hello back');
});

let port = 3000;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});
