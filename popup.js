(function() {
	"use strict";


	var HTMLcodeContent;

	window.onload = function() {
		HTMLcodeContent = document.getElementById("htmlCode");

		chrome.tabs.executeScript(null, {file: "HTMLCodeGenerator.js"}, function() {
			if(chrome.runtime.lastError){
				HTMLcodeContent.innerHTML = "HTML generator produced an error: " + chrome.runtime.lastError.message;
			}
		});
	};

	chrome.runtime.onMessage.addListener(function(message, sender, response) {
		HTMLcodeContent.innerHTML = message;
		console.log(HTMLcodeContent.innerHTML);
		determineValidHTML();
	});

/*
To be checked:
- properly nested
- all tags are closed (self-closing ones as well)
- must be in all lowercase
- one root element
- DOCTYPE must be present 	                          DONE
- must have a head, html, title and body attribute
- Attributes:
	- must be lowercase
	- enclosed in quotes
	- minimalization is forbidden
	- xmlns element must be present in head

*/
	function determineValidHTML() {
		if(!doctypePresent()) {
			HTMLcodeContent.innerHTML = "DOCTYPE missing, not valid XHTML";
		} else if(properlyNested()){
			console.log("properly nested");
		} else {
			console.log("not properly nested");
		}
	}

	function doctypePresent() {
		if(HTMLcodeContent.innerHTML.includes("&amp;lt;!DOCTYPE")) {
			return true;
		} else {
			return false;
		}
	}

	function properlyNested() {
		var selfClosingTags = ["<area />", "<base />", "<br />", "<col />", "<command />", "<embed />", "<hr />", "<img />", "<input />", "<keygen />", "<link />", "<meta />", "<param />", "<source />", "<track />", "<wbr />"];
		var stack = [];
		for(var i = 0; i < HTMLcodeContent.innerHTML.length;) {
			var currentTag = HTMLcodeContent.innerHTML.substring(HTMLcodeContent.innerHTML.substring(i).indexOf("&amp;lt;") + i, HTMLcodeContent.innerHTML.substring(i + 1).indexOf("&amp;gt;") + i + 1 + "&amp;gt;".length);
			i += HTMLcodeContent.innerHTML.substring(i).indexOf("&amp;lt;") + currentTag.length;
			//console.log(currentTag);
			if (currentTag.match(/&amp;lt;[a-z1-9]+&amp;gt;/)) { //opening tag
				stack.push(currentTag);
				console.log(currentTag);
			} else if(currentTag.match(/&amp;lt;\/[a-z1-9]+&amp;gt;/)) { //closing tag
				var topElement = stack.pop();
				console.log(topElement);
				if(topElement.substring(8, topElement.indexOf("&amp;gt;")) !== currentTag.substring(9, currentTag.indexOf("&amp;gt;"))) {
					console.log("opening tag" + topElement.substring(8, topElement.indexOf("&amp;gt;")));
					console.log("closing tag" + currentTag.substring(9, topElement.indexOf("&amp;gt;")));
					console.log("terminate" + currentTag);
					return false;
				}
			}
		}
		//console.log(stack.length);
		if (stack.length != 0) {
			return false;
		}
		return true;
	}
}) ();