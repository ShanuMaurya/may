const ms = require('ms');
const moment = require('moment');
  function punishment() {
    setInterval(async () => {
      let arr = await r.table('timers').filter({userID : "NONE"}).run();
      if (arr[0].inPunishQueue[0]) {

          for (var i = 0; i < arr[0].inPunishQueue.length; i++) {

            let guildID = arr[0].inPunishQueue[i]['guildID'];
            let userID = arr[0].inPunishQueue[i]['userID'];
            let usersUnix = await r.table('timers').filter({
              guildID : guildID,
              userID  : userID
            }).run()

            if (usersUnix[0].mute &&(usersUnix[0].mute < Date.now())) {

              logger.info('Removed new muted role [auto]');
              let muteRole = client.guilds.get(guildID).roles.find('name', 'may-muted');
              client.guilds.get(guildID).members.get(userID).removeRole(muteRole);
              let p = arr[0].inPunishQueue;

              function findInd(element) {
                return element.userID === userID && element.guildID === guildID;
              }

              p.findIndex(findInd)

              let appendToArray = (table, uArray) => r.table(table)
             .filter({userID : "NONE"})
             .update(object => ({ [uArray]: object(uArray)
             .default([]).deleteAt(p.findIndex(findInd)) }))
             .run();

             if (usersUnix[0].ban) {
               await r.table("timers")
               .filter({guildID : msg.guild.id, userID : msg.author.id})
               .update({mute : null}).run();
             } else {

               //Else, delete the document
               appendToArray('timers', 'inPunishQueue');
               await r.table('timers').filter({
                 guildID : guildID,
                 userID  : userID
               }).delete().run();

              }
            }
            if (usersUnix[0].ban && (usersUnix[0].ban < Date.now())) {
              logger.info('Unbanned new user [auto]');
            }
          }
        }
      }, ms('10s'));
  }

module.exports = punishment;
