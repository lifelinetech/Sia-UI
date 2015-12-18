'use strict';

function upload(filePath, nickname, callback) {
	notify('Uploading ' + nickname + ' to Sia Network', 'upload');
	Siad.apiCall({
		url: '/renter/files/upload',
		qs: {
			source: filePath,
			nickname: nickname,
		},
	}, exitFileAdder);
}

function loadDotSia(filePath, callback) {
	notify('Adding ' + nameFromPath(filePath) + ' to library', 'siafile');
	Siad.apiCall({
		url: '/renter/files/load',
		qs: {
			filename: filePath,
		}
	}, exitFileAdder);
}

// Checks whether a path starts with or contains a hidden file or a folder.
function isUnixHiddenPath(path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
}

// Non-recursively upload all files in a directory
function uploadDir(dirPath, nickname, callback) {
	// Upload files one at a time
	Fs.readdir(dirPath, function(err, files) {
		if (err) {
			notify('Failed retrieving directory contents', 'error');
			return;
		}
		files.forEach( function(file) {
			var filePath = Path.join(dirPath, file);

			// Skip hidden files and directories
			Fs.stat(filePath, function(err, stats) {
				if (err) {
					notify('Cannot read ' + file, 'error');
					return;
				}
				if (!isUnixHiddenPath(filePath) && stats.isFile()) {
					upload(filePath, nickname + file);
				}
			});
		});
	});
}

function loadAscii(ascii, callback) {
	notify('Adding file(s) to library', 'asciifile');
	Siad.apiCall({
		url: '/renter/files/loadascii',
		qs: {
			file: ascii,
		}
	}, exitFileAdder);
}

