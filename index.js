var http = require("http");
var sys = require('sys')
var exec = require('child_process').exec;
var url = require("url");
const execSync = require('child_process').execSync;

function onRequest(request, response) {
    try {
        response.setHeader('Access-Control-Allow-Origin', 'https://ayo.ju.edu.et:8880');
        response.setHeader('Access-Control-Request-Method', 'OPTIONS, GET');
        response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
        response.setHeader('Access-Control-Allow-Headers', 'Origin');

        var params;
        var command;
        params = url.parse(request.url, true).query;

        switch (params.command) {
            case 'STATUS':
                return response.end(JSON.stringify({ status: true, message: "OK" }));
            case 'TO_SPEAKER':
                command = "pacmd set-sink-port 0 analog-output-speaker";
                break;
            case 'TO_HEADPHONE':
                command = "pacmd set-sink-port 0 analog-output-headphones";
                break;
            default:
                return response.end(JSON.stringify({ status: false, message: "Some Kind of Error Occurred" }));
        }

        const output = execSync(command, { encoding: 'utf-8' });  // the default is 'buffer'

        response.writeHead(200, { 'Content-Type': 'application/json' });
        if (!output || output === 'undefined')
            response.end(JSON.stringify({ status: true, message: "Changing playback Device Successful" }));
        else
            response.end(JSON.stringify({ status: false, message: "unable to change the playback device" }));
    } catch (error) {
        return response.end(JSON.stringify({ status: false, message: "Error Occurred" }));

    }


}

http.createServer(onRequest).listen(10023);
