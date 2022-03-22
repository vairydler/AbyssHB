(function()
{
	function GameInitializer()
	{
		function defval(){
			return {
				デッキテキスト:"",
				modelist:["攻撃","防御"],
				動作モード:"防御",
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
					let temp;

					temp = dataobj.get("m");
					if( temp ) this.動作モード = temp;
					temp = dataobj.get("d");
					if( temp ) this.デッキテキスト = temp.split(",").join("\n");
					temp = dataobj.get("a");
					if( temp ) this.答え = temp.split(",");
				},
				duplicate(char){
					let tempary = this.答え.filter(val=>(val==char));
					return tempary.length > 1;
				},
                入れ替え開始(e,配列名,idx){
                    let tempobj = {
                        配列:配列名,
                        インデックス:idx
                    };

                    e.dataTransfer.setData("text/plain", JSON.stringify(tempobj));
                },
                入れ替え終了(e,配列名,idx){
                    let tempobj = JSON.parse( e.dataTransfer.getData("text/plain") );

                    let swap = this[配列名][tempobj.インデックス];
                    this[配列名][tempobj.インデックス] = this[配列名][idx];
                    this[配列名][idx] = swap;
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