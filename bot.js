const TelegramBot = require('node-telegram-bot-api');
const token = '1291030278:AAH3_p08U_GuM6srJFCbBRiC94JoAf7fI84';
const bot = new TelegramBot(token, { polling: true });
bot.onText(/#./, (msg, match) => {
  var start = [];
  start = msg.text.split(" ");
  var FirstName,MiddleName,Key;
  FirstName = start[1];
  MiddleName = start[2];
  Key = start[3];
  var now = new Date().toLocaleDateString();
  var SQL = "INSERT INTO log (datetime,chatId,message,caseId) VALUES ('"
            +now+"',"+msg.chat.id+",'"+FirstName+" "+MiddleName+"',"+Key+");UPDATE log;"
  Insert(SQL);
  console.log(Key,FirstName,MiddleName);
  var MSG = "";
  MSG = mSelect("select text from cases where id = " + Key,"text");
  MSG = MSG.replace("<FirstName>",FirstName);
  MSG = MSG.replace("<MiddleName>",MiddleName);
  buts = mSelect("select button from cases where id = " + Key,"button");
  buts = manySelect("SELECT label as text, description as callback_data FROM buttons Where ID IN (" + buts + ")");
  var arrButs =[];
  arrButs = getKeyboard(buts);
  console.log(msg.chat.id);
  bot.sendMessage(msg.chat.id, MSG, {
    reply_markup: {
      inline_keyboard: arrButs
    }
  });
});
bot.on('callback_query', (msg, match) => {
  var but,buts;
  but = msg.data;
  buts = manySelect("SELECT description as text, message as callback_data FROM messages Where ID IN (" + but + ")");
  var arrButs =[];
  arrButs = getKeyboard(buts);
  bot.sendMessage(msg.message.chat.id,"Ваш ответ обрабатывается...", {
    reply_markup: {
      inline_keyboard: arrButs
    }
  });
});
bot.on('message', (msg, match) => {
  const chatId = msg.chat.id;
  const first_name = msg.chat.first_name;
  const last_name = msg.chat.last_name;
  if (msg.text[0]!="#"){
    if (MSGisCardNum(msg)){
      bot.sendMessage(chatId,
        mSelect("SELECT description FROM messages WHERE ID = 2","description"))
    }else{
      bot.sendMessage(chatId,
        mSelect("SELECT description FROM messages WHERE ID = 1","description"))
    };
    var but,buts,FIO,logId;
    but = msg.data;
    buts = manySelect("SELECT id FROM cases Where NOT ID IN (SELECT DISTINCT	caseId FROM log Where chatId = "+chatId+") LIMIT 1")[0]['id'];
    FIO = manySelect("SELECT message FROM log Where chatId = "+chatId+" LIMIT 1")[0]['message'];
    bot.sendMessage(chatId,"ПОПРОБУЕМ ЕЩЁ РАЗ)))");
    sendRetryMessage(chatId,"# "+ FIO + " " +buts);
  };
});
function sendRetryMessage(chatId,msg){
  var start = [];
  start = msg.split(" ");
  var FirstName,MiddleName,Key;
  FirstName = start[1];
  MiddleName = start[2];
  Key = start[3];
  var now = new Date().toLocaleDateString();
  var SQL = "INSERT INTO log (datetime,chatId,message,caseId) VALUES ('"
            +now+"',"+chatId+",'"+FirstName+" "+MiddleName+"',"+Key+");UPDATE log;"
  Insert(SQL);
  console.log(Key,FirstName,MiddleName);
  var MSG = "";
  MSG = mSelect("select text from cases where id = " + Key,"text");
  MSG = MSG.replace("<FirstName>",FirstName);
  MSG = MSG.replace("<MiddleName>",MiddleName);
  buts = mSelect("select button from cases where id = " + Key,"button");
  buts = manySelect("SELECT label as text, description as callback_data FROM buttons Where ID IN (" + buts + ")");
  var arrButs =[];
  arrButs = getKeyboard(buts);
  console.log(chatId);
  bot.sendMessage(chatId, MSG, {
    reply_markup: {
      inline_keyboard: arrButs
    }
  });
};
function MSGisCardNum(msg){
  var msgCl;
  msgCl = msg.text;
  msgCl = msgCl.replace(" ","");
  var re1 = new RegExp("\\d{16,}");
  console.log(re1.test(msgCl));
  if (re1.test(msgCl)) {
    return true;
  }else{
    return false;
  };
};
function mSelect(SQL,val){
  var sqlite = require('sqlite-sync'); 
  sqlite.connect("r2d2max.sqlite");
  var rez;
  rez = sqlite.pvSELECT(SQL)[0];
  return rez[val];
};
function manySelect(SQL){
    var sqlite = require('sqlite-sync'); 
    sqlite.connect("r2d2max.sqlite");
    var rez;
    rez = sqlite.pvSELECT(SQL);
    return rez;
};
function Insert(SQL,data){
  var sqlite = require('sqlite-sync'); 
  sqlite.connect("r2d2max.sqlite");
  var rez;
  rez = sqlite.insert(SQL,data);
  return rez;
};
function getKeyboard(butts){
    var mainkeyboard = [];
    var keyboard = [];
    for (i=0;i<butts.length;i++){
      let mbutt = butts[i];
      keyboard.push(mbutt);
    };
    mainkeyboard.push(keyboard);
    return mainkeyboard
};
function getRetryBut(butts){
  var mainkeyboard = [];
  var keyboard = [];
  for (i=0;i<butts.length;i++){
    let mbutt = butts[i];
    keyboard.push(mbutt);
  };
  mainkeyboard.push(keyboard);
  return mainkeyboard
};
function Insert(SQL){
  var sqlite = require('sqlite-sync');
  sqlite.connect("r2d2max.sqlite");
  sqlite.pvINSERT(SQL);
};