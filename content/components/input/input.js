_c.component({
    type: "input",
    keyup: function (evt) {
		if(evt.keyCode === 13) {
			var enter = this.$el.attr("cosy-enter");
			if(enter) {
				this.module[enter](evt, this.model);
				this.model.set("value", "");
			}
		}
    }
});