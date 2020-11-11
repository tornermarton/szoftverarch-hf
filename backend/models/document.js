const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
    arxiv_id: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('documentModel', documentSchema);