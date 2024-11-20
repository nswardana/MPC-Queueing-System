'use strict';
const db = require('../models/index.js');
const CONFIG = require(__dirname + '/../config/config.json');
const axios = require('axios');
const Message = db.Message;
exports.sendWa = async function(req, res){
  
      let result = { success: false, message: null, data: {} };
      let message = await Message.findAll({
        attributes: ["id", "no_hp", "message", "issent"],
        where: {
          issent: false,
        },
        order: [["id", "desc"]],
        limit: 1, // Fetch only 10 messages
        offset: 0, // Starting point (use for pagination)

      });

      console.log("message");
      console.log(message);

      if (message[0]) {
        //masukan tiket no 1 ke dokter yang berjaga
        var dataMessage = message[0];
        dataMessage.no_hp = "0818223304";

        var data = JSON.stringify({
          api_key: CONFIG.watzap.api_key,
          number_key: CONFIG.watzap.number_key,
          phone_no: dataMessage.no_hp,
          message: dataMessage.message,
        });

        var config = { method: "post", maxBodyLength: Infinity, url: "https://api.watzap.id/v1/send_message", headers: { "Content-Type": "application/json" }, data: data };

        var isSent = false;
        axios(config)
          .then(async function(response) {
            var isSent = true;
            result.message = "Successfully send and closed message.";
            //jika berhasil mengiriim, update issent menjadi TRUE
            let updateMessage = await Message.findByPk(dataMessage.id);
            await updateMessage.update({ issent: isSent });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
      result.success = isSent;
      res.send(result);
    
}


