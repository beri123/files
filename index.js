var http = require("http");
var sys = require('sys')
var exec = require('child_process').exec;
var url = require("url");

function onRequest(request, response) {
    var params = url.parse(request.url,true).query;
    var comm = "";
    console.log(params.command);
   if(params.command == 'TO_SPEAKER')
	comm = "pacmd set-sink-port 0 analog-output-speaker";
   else if (params.command == 'TO_HEADPHONE' )
	comm = "pacmd set-sink-port 0 analog-output-headphones";
    const execSync = require('child_process').execSync;
    // import { execSync } from 'child_process';  // replace ^ if using ES modules
    const output = execSync(comm, { encoding: 'utf-8' });  // the default is 'buffer'
    //console.log('Output was:\n', output);
    response.writeHead(200, {'Content-Type': 'text/plain'});
    if(!output)response.end("Changing playback Device Successful");
    else  response.end("unable to change the playback device");
   
}

http.createServer(onRequest).listen(8888);
