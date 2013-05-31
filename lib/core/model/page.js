module.exports = function(mongoose) {

    var schema = new mongoose.Schema({
        name:       { type: String, required: true },
        route:      { type: String, required: true },
        layout:     { type: mongoose.Schema.Types.ObjectId, ref: 'Layout', required: false},
        grid:       { type: mongoose.Schema.Types.ObjectId, ref: 'Grid', required: true},
        modified:   { type: Date, default: Date.now },
        created:    { type: Date, default: Date.now }
    });

   return mongoose.model('Page', schema);
};