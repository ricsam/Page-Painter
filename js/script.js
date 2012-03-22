
function setEventListeners () {
	var action_ctrl = document.getElementsByClassName('action');
	for (var i = 0; i < action_ctrl.length; i++) {
		action_ctrl[i].addEventListener('mouseup', function() {
			window.close();
		}, false);
	}
	chrome.tabs.executeScript(null, {file: "js/control.js"}, function(){
		chrome.tabs.executeScript(null, {code: "PROPS.CANVAS.initialize()"});
	});
	chrome.tabs.insertCSS(null, {file: "css/control.css"});

	document.getElementById('free_draw').addEventListener('click', function(){
		chrome.tabs.executeScript(null, {code: "PROPS.field = 'canvas';PROPS.CANVAS.drawType = 'free';"});
	}, false);
	document.getElementById('line_draw').addEventListener('click', function(){
		chrome.tabs.executeScript(null, {code: "PROPS.field = 'canvas';PROPS.CANVAS.drawType = 'line';"});
	}, false);
	document.getElementById('square_draw').addEventListener('click', function(){
		chrome.tabs.executeScript(null, {code: "PROPS.field = 'canvas';PROPS.CANVAS.drawType = 'square';"});
	}, false);
	document.getElementById('eraser_draw').addEventListener('click', function(){
		chrome.tabs.executeScript(null, {code: "PROPS.field = 'canvas';PROPS.CANVAS.drawType = 'eraser';"});
	}, false);
	document.getElementById('undo_draw').addEventListener('click', function(){
		chrome.tabs.executeScript(null, {code: "PROPS.field = 'canvas';PROPS.CANVAS.edit.undo();"});
	}, false);
	document.getElementById('redo_draw').addEventListener('click', function(){
		chrome.tabs.executeScript(null, {code: "PROPS.field = 'canvas';PROPS.CANVAS.edit.redo();"});
	}, false);

}


document.addEventListener('DOMContentLoaded', function () {
	setEventListeners();
	var properties = {
		lineNumbers: true,
		indentWithTabs: true,
		lineWrapping: true,
		tabSize: 2,
		onKeyEvent: function(editor, key) {
			var cur = editor.getCursor(true);
			if (key.keyCode == 46 && cur.line == (editor.lineCount() - 2) && cur.ch == editor.lineInfo(cur.line).text.length) {
				throw 'Stop from deleting last line :/ ';
			}
			if (key.keyCode == 8 && cur.line == 1 && cur.ch < 1) {
				throw 'Stop from deleting to much :/ '
			}
		},
		onCursorActivity: function() {
			var editor = arguments[0];
			var top_line = editor.getCursor(true);
			var bottom_line = editor.getCursor(false);
			if (top_line.line == 0 || bottom_line.line == (editor.lineCount() - 1)) {
				if (editor.getOption('readOnly') == false) {
					editor.setOption('readOnly', true);
				}
			} else {
				if (editor.getOption('readOnly') == true) {
					editor.setOption('readOnly', false);
				}
			}
		}
	}

	var editor_elms = [
		document.getElementById("css-prop-editor"),
		document.getElementById("javascript-prop-editor")
	];
	var css_editor = CodeMirror.fromTextArea(editor_elms[0], properties);
	var js_editor = CodeMirror.fromTextArea(editor_elms[1], properties);

	css_editor.setOption('mode', 'css');
	js_editor.setOption('mode', 'javascript');
	js_editor.setOption('matchBrackets', true);
	js_editor.getScrollerElement().style.height = '100px';
	css_editor.getScrollerElement().style.height = '100px';
	js_editor.getScrollerElement().style.width = '770px';
	css_editor.getScrollerElement().style.width = '770px';
	js_editor.setLineClass(0,'js-first-line');
});
