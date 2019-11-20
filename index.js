const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const pdf = require("html-pdf");

var options = { format: 'Letter' };

var starGazers = 0;

inquirer
  .prompt([
    {
    message: "Enter your GitHub username:",
    name: "username"
    },
    {
      message:"What's your favorite color?",
      name:"color"
    }
])
  .then(function({ username, color }) {
    const queryUrl = `https://api.github.com/users/${username}`;

    function repoSearch(){
        const starUrl =`https://api.github.com/users/${username}/repos?per_page=100`
        axios.get(starUrl).then(function(results){
            const repoData= results.data;
            for(var i=0; i>10; i++){
            starGazers= starGazers+ repoData.stargazer_count;
            };
        });
        
    };

    axios.get(queryUrl)
    .then(function(results) {
      const dataSet= results.data;

      const name = dataSet.name;
      const login = dataSet.login;
      const photoSource = dataSet.avatar_url;
      const mapLink = `https://www.google.com/maps/place/${dataSet.location}/`;
      const ghLink = `https://github.com/${username}`;
      const blogLink = `https://github.com/${username}?tab=repositories`;
      const bio = dataSet.bio;
      const repoSum = dataSet.public_repos;
      const followers = dataSet.followers;
      const following = dataSet.following;
      repoSearch();

      const HTMLDoc=
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">git 
          
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          <style>
          a{
              font-size:16px;
          }
          body{
              background-color: black;
              font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
              margin:50px;
          }
          header{
              background-color: ${color};
              color:black;
              font-size:35px;
              margin-bottom:30px;
              text-align: center;
          }
          #newFoot{
              background-color:${color};
              bottom: 0px;
              color:black;
              display: flex;
              height: 40px;
              justify-content: center;
              margin-top: 15px;
              position: absolute;
          }
          #profilePic{
              border-radius:8px;
              height: 200px;
              width: 200px;
          }
          #row1{
              background-color: ${color};
              border-radius: 8px;
              justify-content: space-around;
              padding:10px;
          }
          #row2{
              background-color: ${color};
              border-radius: 8px;
              justify-content: space-around;
              padding:10px;
          }
          </style>
          <title>Developer Profile</title>
        </head>
        <body>
            <header>
            Developer Profile
            </header>
            
            <div class= "container">
                <div class="row" id ="row1">
                    
                    <div class="col-md-6">
                        <h1>${name}</h1>
                        <h2>${login}</h1>
                        <h3>${dataSet.location}</h3>
                        <h5>GitHub:</h5>
                        <p><a href="${ghLink}">Find of GitHub</a></p>   
                        <h5>Blog:</h5>
                        <p><a href="${blogLink}">See Blog Here</a></p> 
                        <p><a href=${mapLink}>See on Google Maps</a></p>
                    </div>
                    <div class="col-md-6">
                        <img id="profilePic" src="${photoSource}" alt="profilePhoto">
                    </div>

                </div>
                <br>
                <br>
                <div class="row" id="row2">
                        <div class="col-md-6">
                            <h4>Bio:</h4>
                                <p>${bio}</p>
                                <br>
                            <h5>Number of GitHub Followers:</h5>
                                <p> ${followers}</p>
                            <h5>Star Gazer count:</h5> 
                                <p>${starGazers}</p>
                            <h5>Following:</h5> 
                                <p>${following} users</p>
                        </div>
                        
                        <div class="col-md-6">
                                <h5>Total Repositories:</h5>
                                <p>${repoSum}</p>
                        </div>
                </div>
            
            </div>

            </body>

            </html>`
            
        fs.writeFile("Developer-Profile.html", HTMLDoc, function(err, success) {
          if (err) {
            throw err;
          } console.log(`success: ${success}`);
          writePDF();
        });
    })
  });

  function writePDF(){
    var html = fs.readFileSync("Developer-Profile.html", 'utf8');
    pdf.create(html, options).toFile("./Developer-Profile.pdf", function(err){
        if (err){
            throw err;
        } console.log("Run Complete, check files.")
    }) 
    
  };
  