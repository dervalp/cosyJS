_c.component({
    type: "button",
    events: {
    	"click" : "click"
    },
    click: function() {
		var click = this.$el.attr("cosy-click");
		this.module[click]();
    }
});