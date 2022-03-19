(function()
{
	function GameInitializer()
	{
		function defval(){
			return {
				デッキテキスト:"",
				modelist:["攻撃","防御"],
				動作モード:"",
				答え:new Array(8),
			};
		};

		const gi = {
			data(){
				return defval();
			},
			computed:{
				防御:{
					get(){
						return (this.動作モード == "防御");
					}
				},
				攻撃:{
					get(){
						return (this.動作モード == "攻撃");
					}
				},
				デッキ配列:{
					get(){
						return this.デッキテキスト.split("\n");
					}
				}	
			},
			watch:{
			},
			methods:{
				generateUrl(){
					let paramobj = {};
					paramobj.m = this.動作モード;
					paramobj.d = this.デッキ配列.join(",");
					paramobj.a = this.答え.join(",");
					new URLParam().set( paramobj );
				},
				dataset( dataobj ){
					this.動作モード = dataobj.get("m");
					this.デッキテキスト = dataobj.get("d").split(",").join("\n");
					this.答え = dataobj.get("a").split(",");
				},
				duplicate(char){
					let tempary = this.答え.filter(val=>(val==char));
					return tempary.length > 1;
				},
				getParam(){
					return {
						"動作モード":this.動作モード,
						"答え":this.答え,
						"デッキ配列":this.デッキ配列,
					};
				}
			}
		}
		
		return Vue.createApp( gi ).mount( "#gameinitializer" );
	};

	window.GameInitializer = GameInitializer;
})();