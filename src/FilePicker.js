/**
A FilePicker control is used for allowing the user to choose files using the standard picker UI.
	
The onPickFile event fires with a response from the file picker if/when the user chooses a file.
The response object is an array of objects indicating chosen files:

	[
		{
			fullPath: // Absolute File Path.
			iconPath: // Absolute File Path with ExtractFS prefix.
			attachmentType: // File Type (image, document, audio, video)
			size: // File Size in Bytes.
		},
		{
			...
		},
		...
	]
*/

var
	Popup = require('onyx/Popup'),
	CrossAppUI = require('./CrossAppUI');

module.exports = Popup.kind({
	name: "luneos.FilePicker",
	style: "width: 100%; height: 80%;",
	published: {
		/** Optional string or array.  Limits displayed files to the given type (or types).  
			Possible types are: 'image', 'audio', 'video', 'document'.*/
		fileType: undefined, 		
		//* Optional free form string to override the default string displayed at the top panel.
		previewLabel: undefined,	
		//* Optional array of file extension strings, used to filter displayed files.
		extensions: undefined,
		//* Optional boolean indicating if selection of multiple files is allowed.
		allowMultiSelect: false,
		//* Optional string contains the current ringtone absolute file path.
		currentRingtonePath:undefined,
		//* Optional int to set the width of the crop window.
		cropWidth:undefined,
		//* Optional int to set the height of the crop window.
		cropHeight:undefined
	},
	events: {
		//* Sent with a response from the file picker (see above) when the user chooses a file.
		onPickFile:""
	},
	autoDismiss: false,
	floating: true,
	centered: true,
	modal: true,
	scrim: true,
	filePickerPath: "/usr/palm/applications/com.palm.systemui/app/FilePicker/filepicker.html",
	components: [
		{name: "CrossApp", kind:CrossAppUI, style: "width: 100%; height: 100%;", onResult: "handleResult"}
	],
	//* Activates the modal FilePicker UI.
	pickFile: function() {
		this.updateParams();
		this.$.CrossApp.setPath(this.filePickerPath);
		this.show();
	},
	updateParams: function() {
		var params = {};
		var that = this;
		// Copy all published properties to the params object.
		Object.keys(this.published).forEach(function(key) {
			if(that[key] !== undefined) {
				params[key] = that[key];
			}
		});

		// Need to put arrays of types in fileTypes instead of fileType.
		if (this.fileType && typeof(this.fileType) != 'string') {
			params.fileTypes = this.fileType;
			params.fileType = undefined;
		}
		this.$.CrossApp.setParams(params);
	},
	handleResult: function(inSender, result) {
		this.$.CrossApp.setPath("");
		this.hide();
		if (result.result) {
			this.doPickFile(result.result);
		}
	}
});
