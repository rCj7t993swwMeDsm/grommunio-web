Ext.namespace('Zarafa.common.form');

/**
 * @class Zarafa.common.form.TextArea
 * @extends Ext.form.TextArea
 * @xtype zarafa.textarea
 *
 * The Textarea which extends{@link Ext.form.TextArea} and adds extra functionality
 * like inserting text at cursor position.
 */
Zarafa.common.form.TextArea = Ext.extend(Ext.form.TextArea, {

	/**
	 * @cfg {Boolean} enableSystemContextMenu Enable the browser's default contextmenu
	 * to be opened on this {@link #el element}.
	 */
	enableSystemContextMenu: false,

	/**
	 * Called during {@link #render}. If {@link #enableSystemContextMenu} is enabled, this
	 * will apply the 'zarafa-contextmenu-enabled' CSS class on the {@link #el element}.
	 * @param {Ext.Container} ct The container in which the component is being rendered
	 * @param {Number} position The position inside the container where the component is being rendered
	 * @private
	 */
	onRender: function(ct, position)
	{
		Zarafa.common.form.TextArea.superclass.onRender.apply(this, arguments);

		if (this.enableSystemContextMenu) {
			this.el.addClass('zarafa-contextmenu-enabled');
		}

		this.el.on('dragover', this.onFileDragOver, this);
		this.el.on('drop', this.onFileDrop, this);
	},

	/**
	 * Prevent the browser from opening dropped files.
	 * @param {Ext.EventObject} e The drag event
	 * @private
	 */
	onFileDragOver: function(e)
	{
		var dt = e.browserEvent.dataTransfer;
		if (dt && (Array.prototype.indexOf.call(dt.types, 'Files') >= 0 || dt.files.length > 0)) {
			e.preventDefault();
		}
	},

	/**
	 * Block file drops and show an error notification. The HTML
	 * editor (TinyMCE) does this automatically, but the plain text
	 * textarea has no such handling.
	 * @param {Ext.EventObject} e The drop event
	 * @private
	 */
	onFileDrop: function(e)
	{
		var dt = e.browserEvent.dataTransfer;
		if (dt && (Array.prototype.indexOf.call(dt.types, 'Files') >= 0 || dt.files.length > 0)) {
			e.preventDefault();
			container.getNotifier().notify('error', _('Attachment error'),
				_('Dropped file type is not supported'));
		}
	},

	/**
	 * Function adds passed text in textarea at cursor's position.
	 * @param {String} text The text value which you want to add in text area
	 */
	insertAtCursor: function(text) {
		var startPos = this.el.dom.selectionStart;
		var endPos = this.el.dom.selectionEnd;
		this.el.dom.value = this.el.dom.value.substring(0, startPos)
			+ text
			+ this.el.dom.value.substring(endPos, this.el.dom.value.length);

		this.el.focus();
		this.el.dom.setSelectionRange(endPos + text.length, endPos + text.length);
	},

	/**
	 * Function sets the cursor position to the start of the text
	 */
	setCursorLocation: function()
	{
		var textAreaDom = this.getEl().dom;

		// When a user replies to an email and the textarea contains text then by default
		// the cursor is set to the end of the text. The following code sets the cursor position to
		// the start of the text.
		var textLen = textAreaDom.textLength;
		var startPos = textAreaDom.selectionStart;
		var endPos = textAreaDom.selectionEnd;

		if(startPos === textLen && endPos === textLen) {
			textAreaDom.setSelectionRange(0,0);
		}
	},

	/**
	 * Function select the text in editor by given selector.
	 *
	 * @param {String} selector The selector query which used to select the text in editor.
	 * @return {boolean} return true if text is selected in editor else false.
	 */
	selectBySelector: Ext.emptyFn,
});

Ext.reg('zarafa.textarea', Zarafa.common.form.TextArea);
