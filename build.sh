echo "Converting MIDI to JSON..."
node node_modules/midi-timing/cli.js song.mid song.json

echo "Creating Media Config..."
node node_modules/frampton/src/cli/config-generator.js videos

echo "Building output..."
node node_modules/browserify/bin/cmd.js score.js -o js/build.js

echo "Open this link in Chrome! http://localhost:3000"
node node_modules/serve/bin/serve
