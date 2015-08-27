/**
 * Created by Ozy on 8/9/2015.
 */
function Card( obj){
    console.log("creating new card");
    this.image_uri = obj.image_uri;
    this.id = obj.id;
    this.name = obj.name;
    this.set_code = obj.set_code;
    this.type = obj.type;
}