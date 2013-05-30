module.exports = function(mongoose) {

    var schema = new mongoose.Schema({
        name:       { type: String, required: true },
        path:       { type: String, required: true },
        modified:   { type: Date, default: Date.now },
        created:    { type: Date, default: Date.now },
        hygge: 		{ type: String, required: false } /*Hygge is the reference to a static file definition */
    });

   return mongoose.model('Layout', schema);
};