var
	PortsHeader = require('./PortsHeader'),
	Animator = require('enyo/Animator'),
	Image = require('enyo/Image'),
	InputDecorator = require('onyx/InputDecorator'),
	Input = require('onyx/Input')

module.exports = PortsHeader.kind({
	name: "luneos.PortsSearch",
	title: "WebOS Ports Search",
	taglines: [
		"Shiny search button, PRESS IT!",
	],
	events:{
		onSearch: ""
	},
	components:[
		{name: "SearchAnimator", kind: Animator, onStep: "animatorStep", onStop: "animatorStop"},
		{name: "Icon", kind: Image, src: "icon.png", style: "height: 100%; margin: 0;"},
		{name: "TextDiv",
		tag: "div",
		style: "height: 100%; margin: 0;",
		components: [
			{name: "Title",
			content: "",
			style: "vertical-align: top; margin: 0; font-size: 21px;"},
			{name: "Tagline",
			content: "",
			style: "display: block; margin: 0; font-size: 13px;"}
		]},
		{name: "SearchDecorator",
		kind: InputDecorator,
		style: "position: absolute; top: 10px; right: 8px; width: 32px; padding: 2px 4px 3px 3px; max-width: 100%; float: right", components:[
			{name: "SearchInput",
			id: "searchBox",
			kind: Input,
			selectOnFocus: false, //False initially to prevent focus-stealing
			style: "width: 0;",
			oninput: "inputChanged",
			onblur: "closeSearch"},
			{kind: "Image",
			src: "@../assets/search-input-search.png",
			style: "width: 24px; height: 24px;",
			onmousedown: "openSearch"}
		]}
	],
	openSearch: function(inSender, inEvent) {
		this.$.SearchAnimator.setStartValue(0);
		this.$.SearchAnimator.setEndValue(1);
		this.$.SearchAnimator.play();
	},
	closeSearch: function(inSender, inEvent) {
		this.$.SearchInput.selectOnFocus = true;
		this.$.SearchAnimator.setStartValue(1);
		this.$.SearchAnimator.setEndValue(0);
		this.$.SearchAnimator.play();
	},
	animatorStep: function(inSender, inEvent) {
		//Fix for enyo.Animator returning numbers with e-notation toward the end of the animation
		if(1.0 - inSender.value < 0.00025)
			return;
			
		this.$.SearchInput.applyStyle("width", (this.hasNode().offsetWidth  * inSender.value) - 52 + "px");
		this.$.SearchDecorator.applyStyle("width", this.$.SearchInput.hasNode().offsetWidth + 32 + "px");
		this.$.Icon.applyStyle("opacity", 1.0 - inSender.value);
		this.$.TextDiv.applyStyle("opacity", 1.0 - inSender.value);
		
		if(this.$.SearchAnimator.getStartValue() == 0)
			this.$.SearchInput.focus();
	},
	animatorStop: function(inSender, inEvent) {
	},
	inputChanged: function(inSender, inEvent) {
		this.doSearch({value: this.$.SearchInput.getValue()});
	},
	searchActive: function() {
		return this.$.SearchInput.getValue() != "";
	}
});