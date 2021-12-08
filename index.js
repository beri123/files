var http = require("http");
var sys = require('sys')
var exec = require('child_process').exec;
var url = require("url");
const execSync = require('child_process').execSync;

function onRequest(request, response) {
    try {
        response.setHeader('Access-Control-Allow-Origin', 'https://ayo.ju.edu.et');
        response.setHeader('Access-Control-Request-Method', 'OPTIONS, GET');
        response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        response.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, X-Requested-With, Content-Type, Authorization');
	let output = execSync("pacmd list | grep 'analog-output-headphones'");
	//response.end(JSON.stringify({ status: true, message: "you did not plugged a headphone" }));
        if(output != null && output.toString().includes("available: no)")){ 
        return response.end(JSON.stringify({ status: true, message: "you did not plugged a headphone" }));
        }

        var params;
        var command;
        params = url.parse(request.url, true).query;

        switch (params.command) {
            case 'STATUS':
                return response.end(JSON.stringify({ status: true, message: "OK" }));
            case 'TO_SPEAKER':
                command = "pacmd set-sink-port 1 analog-output-speaker";
                break;
            case 'TO_HEADPHONE':
                command = "pacmd set-sink-port 1 analog-output-headphones";
                break;
            default:
                return response.end(JSON.stringify({ status: false, message: "Command Not Found" }));
        }

        output = execSync(command, { encoding: 'utf-8' });  // the default is 'buffer'

        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (!output || output === 'undefined')
            response.end(JSON.stringify({ status: true, message: "Changing playback Device Successful" }));
        else
            response.end(JSON.stringify({ status: false, message: "Unable to change the playback device" + output }));
    } catch (error) {
        return response.end(JSON.stringify({ status: false, message: "Error Occurred" + error}));

    }


}
const output = execSync("pacmd list | grep 'analog-output-headphones'");
console.log(output.toString());
http.createServer(onRequest).listen(10023);
