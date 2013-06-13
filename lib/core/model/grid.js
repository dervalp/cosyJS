module.exports = function (mongoose) {

	var schema = new mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		gridJSON: {
			type: String,
			required: true
		},
		modified: {
			type: Date,
			default: Date.now
		},
		created: {
			type: Date,
			default: Date.now
		}
	});

	return mongoose.model("Grid", schema);
};