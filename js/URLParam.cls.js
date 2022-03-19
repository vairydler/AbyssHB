(function(){
	class URLParam{
		get( parser )
		{
			var url = new Map();
			var reg = new RegExp("[?&](\\w+)=([^&]*)","g");
			
			for( var match of Array.from(location.search.matchAll( reg )) )
			{
				url.set( match[1], decodeURI(match[2]) );
			}
			
			if( typeof parser == "function" )
			{
				parser( url );
			}
			
			return url;
		}
 
		set( paramobj )
		{
			var paramary = [];
			for( var key in paramobj )
			{
				paramary.push( key + "=" +paramobj[key] );
			}
			
			var paramquery = "?" + paramary.join("&");
			window.location.search = paramquery;
		}
	}

	window.URLParam = URLParam;
})();
