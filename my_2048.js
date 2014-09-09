function Game2048(container){
	this.container=container;
	this.tiles=new Array(16);
}
Game2048.prototype={
		init:function(){
			for(var i=0,l=this.tiles.length;i<l;i++){
				var tile=this.newTile(0);
				this.container.appendChild(tile);
				this.tiles[i]=tile;
			}
			this.randomTile();
			this.randomTile();
		},
        newTile:function(val){
        	var tile=document.createElement("div");
        	this.setTileVal(tile,val);
        	return tile;
        },
        setTileVal:function(tile,val){
        	tile.className="tile tile"+val;
        	tile.setAttribute("val",val);//easy to use for the following actions,set a attr to val
        	tile.innerHTML=val>0?val:'';
        },
        randomTile:function(){
        	//number of empty tiles
        	var zeroTiles=[];
        	for(var i=0,len=this.tiles.length;i<len;i++){
        		if(this.tiles[i].getAttribute('val')==0){
        			zeroTiles.push(this.tiles[i]);
        		}
        	}  
        	//to generate 2 or 4 at location of empty tiles 
        	if(zeroTiles.length!=0){
        		var rTile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
                this.setTileVal(rTile, Math.random() < 0.8 ? 2 : 4);
        	}
             
        },
        move:function(direction){
        	var j;
        	switch(direction){
        	case 'W':
        		for(var i=4,len=this.tiles.length;i<len;i++){
        			j=i;
        			while(j>=4){
        				this.merge(this.tiles[j-4],this.tiles[j]);
        				j-=4;
        			}
        			}
        		break;
        	case 'S':
        		for(i=11;i>=0;i--){
        			j=i;
        			while(j<=11){
        				this.merge(this.tiles[j+4],this.tiles[j]);
        				j+=4;
        			}
        		}
        		break;
        	case 'A':
        		for(i=1;i<this.tiles.length;i++){
        			j=i;
        			if(i%4!=0){
        				while(j%4!=0){
        					this.merge(this.tiles[j-1],this.tiles[j]);
        					j--;
        				}
        			}
        		}
        	    break;
        	case 'D':
        		for(i=14;i>=0;i--){
        			j=i;
        	    	   while(j%4!=3){
        	    		   this.merge(this.tiles[j+1],this.tiles[j]);
        	    		   j++;
        	    	   }
        	       }
        		break;
        	}
        	//当向某个方向移动之后
        	this.randomTile();
        },
        merge:function(preTile,currTile){
        	var preVal=preTile.getAttribute('val');
        	var currVal=currTile.getAttribute('val');
        	if(currVal!=0){
        		if(preVal==0){
        			this.setTileVal(preTile,currVal);
        			this.setTileVal(currTile,0);
        		}else if(preVal==currVal){
        			this.setTileVal(preTile,currVal*2);
        			this.setTileVal(currTile,0);
        		}
        	}
        },
        gameOver:function(){
        	for(var i=0,len=this.tiles.length;i<len;i++){
        		var tileVal=this.tiles[i].getAttribute('val');
        		if(tileVal==0){
        			return false;
        		}
        		if(i%4!=3){
        			if(this.tiles[i+1].getAttribute('val')==this.tiles[i].getAttribute('val')){
        				return false;
        			}
        		}
        		if(i<12){
        			if(this.tiles[i+4].getAttribute('val')==this.tiles[i].getAttribute('val')){
        				return false;
        			}
        		}
        	}
        	return true;
        },
        clean:function(){
        	for(var i=0,len=this.tiles.length;i<len;i++){
        		this.container.removeChild(this.tiles[i]);
        	}
    		this.tiles=new Array(16);
        }
        
};
var game;
var startBtn;
window.onload=function(){
  var container=document.getElementById("div2048");
  startBtn=document.getElementById("start");
  startBtn.onclick=function(){
	  this.style.display="none";
	  game=new Game2048(container);  
	  game.init();
	  //注意window.onkeydown的放置方式，在游戏开始没有点击startBtn时，不要触发键盘事件；并在第二次游戏时重新启用键盘事件
	  window.onkeydown=function(e){
			var keyNum,keyChar;
			if(window.event){
				keyNum=e.keyCode;
			}else if(e.which){
				keyNum=e.which;
			}
			keyChar=String.fromCharCode(keyNum);
			if(['W','A','S','D'].indexOf(keyChar)>-1){
				if(game.gameOver()){
					game.clean();
					startBtn.style.display='block';
					startBtn.innerHTML="game over,replay?";
					//在游戏结束时清除键盘触发事件，否则会产生错误
					window.onkeydown=null;
						return;
				}
				game.move(keyChar);
			}
		};

  };
};

