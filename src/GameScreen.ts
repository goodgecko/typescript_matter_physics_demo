import { Application, Container, Texture, Sprite, Point, Rectangle } from 'pixi.js'
import { Engine, Render, World, Body, Bodies, Mouse, MouseConstraint } from 'matter-js'


export class GameScreen {

    private engine:Engine;

    private sceneObjects:any = [];

    
    constructor( private app:Application ){
    
        this.createMatterEngine();
        
        this.createBoundaryWalls(window.innerWidth, window.innerHeight);

        this.createObjects();

        app.ticker.add( this.gameLoop, this );

        window.addEventListener('resize', this.resize.bind(this));
        this.resize();
    }


    /**
     * creates a basic Matter Engine and adds mouse events so you can click and drag objects
     * 
     */
    private createMatterEngine(){
        // create the matter engine instance.
        this.engine = Engine.create();

        // add a handle for the mouseEvents.
        World.add( this.engine.world, MouseConstraint.create( this.engine ) );

        // start the matter engine
        Engine.run( this.engine );
    }
    

    /**
     * creates four static walls around the edge of the stage
     * 
     * @param worldWidth defines where the bounding wall boxes are built
     * @param worldHeight defines where the bounding wall boxes are built
     */
    private createBoundaryWalls( worldWidth:number, worldHeight:number ){

        let wallTop:Body = Bodies.rectangle( worldWidth * .5, 0, worldWidth, 10, { isStatic: true } );
        let wallBottom:Body = Bodies.rectangle( worldWidth * .5, worldHeight, worldWidth, 10, { isStatic: true } );
        let wallRight:Body = Bodies.rectangle( worldWidth, worldHeight * .5, 10, worldHeight, {  isStatic: true } );
        let wallLeft:Body = Bodies.rectangle(0, worldHeight * .5, 10, worldHeight, { isStatic: true });
    
        World.add( this.engine.world, [ wallBottom, wallTop, wallLeft, wallRight ] );
    }


    /**
     *  small function that starts the build process for several objects
     * 
     */
    private createObjects(){
        
        this.createRectangleBody( "sponge", new PIXI.Rectangle( 200, 100, 200, 100 ), {restitution:0.8} );
        this.createRectangleBody( "sponge_purple", new PIXI.Rectangle( 300, 100, 200, 100 ), {restitution:0.8} );
        this.createCircleBody( "playerRed", new PIXI.Rectangle( 250, 50, 100, 100 ), {restitution:0.8} );     
    }


    /**
     * creates a rectangle physics object and generates the image assosiated with that physical body 
     * 
     * @param imageID ID of the image associated with this object, defined in loading.ts
     * @param bounds The position and size of the object, used to sync size of physics and image
     * @param options Set of options used by Matter.js to assign properties to the physical object 
     */
    private createRectangleBody( imageID:string, bounds:PIXI.Rectangle, options:Matter.IChamferableBodyDefinition ) {
        
        let imageBody:Body = Bodies.rectangle( bounds.x, bounds.y, bounds.width, bounds.height, options );
        let imageSprite:PIXI.Sprite = this.createSprite( imageID, bounds );

        this.addPhysicalObjectToWorld( imageSprite, imageBody );
    }


    /**
     * creates a circle physics object and generates the image assosiated with that physical body 
     * 
     * @param imageID ID of the image associated with this object, defined in loading.ts
     * @param bounds The position and size of the object, used to sync size of physics and image
     * @param options Set of options used by Matter.js to assign properties to the physical object 
     */
    private createCircleBody( imageID:string, bounds:PIXI.Rectangle, options:Matter.IChamferableBodyDefinition   ) {
        
        let imageBody:Body = Bodies.circle( bounds.x, bounds.y, bounds.width*.5, options );
        let imageSprite:PIXI.Sprite = this.createSprite( imageID, bounds );

        this.addPhysicalObjectToWorld( imageSprite, imageBody );
    }


    /**
     *  Creates a PIXI Sprite and adds it to the stage
     * 
     * @param imageID ID of the image associated with this object, defined in loading.ts
     * @param bounds The position and size of the object, used to sync size of physics and image
     */
    private createSprite( imageID:string, bounds:PIXI.Rectangle ): PIXI.Sprite{
        
        let imageSprite:PIXI.Sprite = PIXI.Sprite.from( Texture.from( imageID ) );
        imageSprite.width = bounds.width;
        imageSprite.height = bounds.height;
        imageSprite.x = bounds.x;
        imageSprite.y = bounds.y;
        imageSprite.anchor.set(0.5, 0.5);
        this.app.stage.addChild(imageSprite);

        return imageSprite;
    }


    /**
     * Adds the physical body to the world and creates an object so the game knows which sprite is associated with which physical body
     * 
     * @param imageSprite 
     * @param imageBody 
     */
    private addPhysicalObjectToWorld( imageSprite:PIXI.Sprite, imageBody:Body ) {
        
        World.addBody( this.engine.world, imageBody );
        
        this.sceneObjects.push( {
            body: imageBody,
            sprite: imageSprite,
        } );
    }


    /**
     * races through each sprite and updates its properties to match the physics assosiated with it
     * 
     */
    private gameLoop( ){
        
        this.sceneObjects.forEach( object => {
            object.sprite.position = object.body.position;
            object.sprite.rotation = object.body.angle;
        });
    }


    /**
     * token function so the stage resizes with the window 
     * I should probably update the boundary walls in here.
     */
    private resize() {
        
        this.app.renderer.resize( window.innerWidth, window.innerHeight );
    }
}