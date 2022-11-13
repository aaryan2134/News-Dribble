const express=require('express');
const request = require('request');
const app=express();

app.get('/teams',(req,res,next)=>{
    request('https://data.nba.net/10s/prod/v2/2022/teams.json',
     function (error, response, body) {
         res.send(body)
    });  
});
app.get('/standings',(req,res,next)=>{
  request('https://data.nba.net/10s/prod/v1/current/standings_conference.json',
   function (error, response, body) {
       res.send(body)
  });  
});
app.get('/players',(req,res,next)=>{
  request('https://data.nba.net/10s/prod/v1/2022/players.json',
   function (error, response, body) {
       res.send(body)
  });  
});
app.get('/players/:player_id',(req,res,next)=>{
  const player_id = req.params.player_id;
  request(`https://data.nba.net/10s/prod/v1/2022/players/${player_id}_profile.json`,
   function (error, response, body) {
       res.send(body)
  });  
});

app.get('/scoreboard/:date',(req,res,next)=>{
  const date = req.params.date;
  request(`https://data.nba.net/10s/prod/v1/${date}/scoreboard.json`,
   function (error, response, body) {
       res.send(body)
  });  
});

app.get('/teams/schedule/:code',(req,res,next)=>{
  const code = req.params.code;
  request(`https://data.nba.net/10s/prod/v1/2022/teams/${code}/schedule.json`,
   function (error, response, body) {
       res.send(body)
  });  
});

// api not giving response
// app.get('/boxscore/:date/:gameId',(req,res,next)=>{
//   const date = req.params.date;
//   const gameId = req.params.gameId;
//   request(`https://data.nba.net/10s/prod/v1/${date}/${gameId}_boxscore.json`,
//    function (error, response, body) {
//        res.send(body)
//   });  
// });

// api not giving response
// app.get('/period/:date/:gameId/:period',(req,res,next)=>{
//   const date = req.params.date;
//   const gameId = req.params.gameId;
//   const period = req.params.period;
//   request(`https://data.nba.net/10s/prod/v1/${date}/${gameId}_pbp_${period}.json`,
//    function (error, response, body) {
//        res.send(body)
//   });  
// });

const port =process.env.port || 3001;
app.listen(port,()=>{
    console.log(`From port ${port}`);
});