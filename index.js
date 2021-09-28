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

        const output = execSync(command, { encoding: 'utf-8' });  // the default is 'buffer'

        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (!output || output === 'undefined')
            response.end(JSON.stringify({ status: true, message: "Changing playback Device Successful" }));
        else
            response.end(JSON.stringify({ status: false, message: "Unable to change the playback device" + output }));
    } catch (error) {
        return response.end(JSON.stringify({ status: false, message: "Error Occurred" + error}));

    }


}

http.createServer(onRequest).listen(10023);
