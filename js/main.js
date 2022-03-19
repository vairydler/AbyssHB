document.addEventListener( "DOMContentLoaded",()=>{
	let urlparam = new URLParam().get();

	let gi = new GameInitializer();
	gi.dataset( urlparam );

	let gm = new GameMaster( gi.getParam() );
});
