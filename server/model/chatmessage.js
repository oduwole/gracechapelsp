const mongoose = require('mongoose'),  
      Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({  
  receiver: {
    type: String, //Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    //type: Schema.Types.ObjectId,
    type: String,
    required: true
    //ref: 'User'
  },
  deleted:{
      type: Boolean
  }, 
  created_at:{
      type:Date
  },
  updated_at: {
      type:Date
  }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);  