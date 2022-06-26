

class Monster{
    constructor()
    {
        this.x=0;
        this.y=0;
        this.scale=1;
        this.angle=0;
    }
    //let img=null;
    setImage(img)
    {
        this.img=img;
    }
    draw()
    {
        
        push();
        translate(100,100);
        rotate(this.angle);
        scale(this.scale);
        image(this.img,0,0);
        //image(this.img,this.x,this.y);
        
        pop();
    }
}
