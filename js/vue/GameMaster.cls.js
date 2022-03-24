(function()
{
	function GameMaster( gameparam )
	{
        let internal = {
            前後半判定(idx){
                return (4 > idx) ? "前半":"後半";
            },
            ヒットブロー判定(ary,char,idx){
                let ret;
                let findidx = ary.indexOf( char );
                if( findidx != -1 )
                {
                    ret = ( internal.前後半判定( findidx ) == internal.前後半判定( idx ) ) ? "H" : "B";
                }
                return ret;
            }
        };

        function defval(){
          return {
            デッキ配列:gameparam.デッキ配列,
            攻撃提案:[...new Array(8)],/* こうしないとforEach族が変な挙動 */
            防御提案:"",
            履歴:[]
          }
        };

        const gm ={
            data(){
                return defval();
            },
            computed:{
                防御:{
                    get(){
                        return (gameparam.動作モード == "防御");
                    }
                },
                攻撃:{
                    get(){
                        return (gameparam.動作モード == "攻撃");
                    }
                },
                notfill:{
                    get(){
                        let ret = this.攻撃提案.some(e=>(e==undefined));
                        return ret;
                    }
                },
            },
            watch:{
                targets:{
                    handler(newdata){
                    },
                    deep:true
                }
            },
            methods:{
                防御確定(){
                    let 履歴レコード = {};

                    let 前後半 = this.防御提案.split("\n");

                    履歴レコード.キャラ = [...前後半[0].split(","),...前後半[1].split(",")];
                    履歴レコード.H = 0;
                    履歴レコード.B = 0;

                    履歴レコード.キャラ.forEach(
                        (e,i)=>
                        {
                            switch( internal.ヒットブロー判定( gameparam.答え,e,i) )
                            {
                                case "H":
                                    履歴レコード.H++;
                                    break;
                                case "B":
                                    履歴レコード.B++; 
                                    break;
                            }
                        }
                    )

                    this.履歴.push( 履歴レコード );
                },
                攻撃確定(){
                    let 履歴レコード = {};
                    履歴レコード.キャラ = [...this.攻撃提案];
                    履歴レコード.H = 0;
                    履歴レコード.B = 0;

                    this.履歴.push( 履歴レコード );
                    this.コピー(this.履歴.length-1);
                },
                削除(idx){
                    if( window.confirm("削除する？") )
                    {
                        this.履歴.splice(idx,1);
                    }
                },
                コピー(idx){
                    let 前半 = [...this.履歴[idx].キャラ].splice(0,4);
                    let 後半 = [...this.履歴[idx].キャラ].splice(4,4);
                    
                    navigator.clipboard.writeText(前半.join(",") + "\n" + 後半.join(","));
                },
                反映(idx){
                    this.攻撃提案 = [...this.履歴[idx].キャラ];
                },
				duplicate(char){
                    let ret = false;
                    let duplicate = (char)=>
                    {
					    let tempary = this.攻撃提案.filter(val=>(val==char));
                        return (tempary.length > 1);
                    };

                    if( char )
                    {
                        ret = duplicate( char );
                    }
                    else
                    {
                        ret = this.攻撃提案.some(e=>duplicate(e));
                    }
					return ret;
				},
                ヒット(キャラ,idx){
                    if( gameparam.動作モード == "防御"){
                        return internal.ヒットブロー判定( gameparam.答え,キャラ,idx) == "H";
                    }
                    else
                    {
                        return internal.ヒットブロー判定( this.攻撃提案,キャラ,idx) == "H";
                    }
                },
                ブロー(キャラ,idx){
                    if( gameparam.動作モード == "防御"){
                        return internal.ヒットブロー判定( gameparam.答え,キャラ,idx) == "B";
                    }
                    else
                    {
                        return internal.ヒットブロー判定( this.攻撃提案,キャラ,idx) == "B";
                    }
                },
                カウント不一致(履歴idx,ヒットブロー){
                    let cnt=0;
                    
                    if( gameparam.動作モード == "防御"){
                        return false;
                    }
                    
                    this.履歴[履歴idx].キャラ.forEach(
                        (e,i)=>
                        {
                            if( internal.ヒットブロー判定( this.攻撃提案,e,i) == ヒットブロー )
                            {
                                cnt++;
                            }
                        }
                    )
                    
                    return (this.履歴[履歴idx][ヒットブロー] != cnt);
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
                    e.preventDefault();
                }
            }
        };
		return Vue.createApp( gm ).mount( "#gamemaster" );
	};

	window.GameMaster = GameMaster;
})();