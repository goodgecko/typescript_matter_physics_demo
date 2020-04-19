import * as PIXI from 'pixi.js';

export class LoadingScreen{

    /**
     * yep, you guessed it, loads in all the assets
     * @param app pixi application - incase you want to add actual loading elements to the stage
     * @param callback the function to call when the loading is complete
     */
    constructor(private app, private callback:Function){
        PIXI.Loader.shared
            .add("sponge_brown", "assets/sponge_brown.png")
            .add("sponge_purple", "assets/sponge_purple.png")
            .add("sponge", "assets/sponge.png")
            .add("playerBlue", "assets/player1.png")
            .add("playerRed", "assets/player2.png")
            .on("progress", this.handleLoadProgress.bind(this))
            .once("load", this.handleLoadComplete.bind(this))
            .once("error", this.handleLoadError.bind(this));

        PIXI.Loader.shared.load()
    }

    private handleLoadProgress() {
        console.log(PIXI.Loader.shared.progress + "% loaded");
    }

    private handleLoadError() {
        console.error("load error");
    }

    private handleLoadComplete() {
        PIXI.Loader.shared.removeAllListeners();

        setTimeout(() => {
            this.callback();
        }, 1000);
    }
}