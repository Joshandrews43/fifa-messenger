var unirest = require('unirest')

unirest.get("https://montanaflynn-fifa-world-cup.p.mashape.com/goals")
.header("accepts", "json")
.header("X-Mashape-Key", "eTHpIVqRJimshJLpws9jRoanPUzsp1j2iywjsnALn8JxrO4APS")
.header("X-Mashape-Host", "montanaflynn-fifa-world-cup.p.mashape.com")
.end(function (result) {
  console.log(result.status, result.headers, result.body);
});

