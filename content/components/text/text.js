_c.component({
    type: "text",
    events: {
    	"click": "test"
    },
    test: function() {
    	alert("test");
    },
    attributes: [
		{ name: "text" }
    ]
});