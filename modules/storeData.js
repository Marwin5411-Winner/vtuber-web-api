const { con } = require("../config/dbcon");

function resultToDB() {}

function channelIdToDB(channel, res) {
  if (channel == null || channel == undefined) {
    res.status(404).send("No data in Form");
  } else {
    const id = channel.id;
    const name = channel.name;
      con.query(`INSERT INTO channelList (id, name) VALUES ('${id}', '${name}')`, function (err, result) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Added Successfully');
        }
      });

  }

}



module.exports = { resultToDB, channelIdToDB };
