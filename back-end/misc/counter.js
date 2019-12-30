const Counters = require("../models/counters");

module.exports = {
  getNextSequence: function(sequenceName, createCollection){
   Counters.findOne({ name: sequenceName })
   .then(counter => {
     if (counter) {
      const counters = new Counters({_id: counter._id, name:sequenceName, next:(counter.next)+1});
      Counters.updateOne({ _id: counter._id }, counters)
      .then(result => {
         if (result.nModified > 0) {
            createCollection(counter.next);
         }
         else{
            console.log("error saving counter");
         }
       })
       .catch(error => {
         console.log("error saving counter"+error);
       });
     } else {
      const counters = new Counters({name:sequenceName, next:2});
      counters.save();
      createCollection(1);
     }
   })
 }
};