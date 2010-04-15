/*!
 * jQuery JavaScript Library v1.0
 * http://jquery.com/
 *
 * Copyright (c) 2009 Daniel Pardo
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: 2009-04-21  
 */
 
 //throw new Error("this is a test error");
 
(function($){
	$.fn.life = function() {
		var defaults = {
	   boardWidth: 20,
	   boardHeight: 20,
	   cellsize: 5,	   
	   timeout: 1000   
		};
		var world = $(this);
		var options = $.extend(defaults, options);				
		var lifedata = new KArray2D(options.boardWidth,options.boardHeight);		
		var tw = options.boardWidth * options.cellsize;
		var th = options.boardWidth * options.cellsize;			
		//board = '<table class="lifeworld" style="width:'+tw+'; height:'+th+'px; border-collapse: collapse; padding: 0px; spacing: 0px;">';
		var board = '';			
		for (r=0; r<options.boardHeight; r++){		
			//board += '<tr>';			
			for (c=0; c<options.boardWidth; c++){									
				float='float: left;';

				ranNum= Math.floor(Math.random()*5);
				if (ranNum==0 || ranNum==1){												
					//board += '<td style="border: solid black;border-width: 1px;color: #FF0000; background: #000000;height:'+options.cellsize+'px;width:'+options.cellsize+'px;" id="'+r+'-'+c+'"></td>';
					board += '<div id="'+r+'-'+c+'" style="border-collapse: collapse;overflow: hidden;'+float+' width: '+options.cellsize+'px; height: '+options.cellsize+'px;border: solid black;border-width: 1px;color: #FF0000; background: #000000;"></div>';												
					lifedata[r][c]=1;					
				}
				else{
					//board += '<td style="border: solid black;border-width: 1px;color: #FF0000; background: #FFFFFF;height:'+options.cellsize+'px;width:'+options.cellsize+'px;"  id="'+r+'-'+c+'"></td>';
					board += '<div id="'+r+'-'+c+'" style="border-collapse: collapse;overflow: hidden;'+float+' width: '+options.cellsize+'px; height: '+options.cellsize+'px;border: solid black;border-width: 1px;color: #FF0000; background: #FFFFFF;"></div>';										
					lifedata[r][c]=0;										
				}						
				if (c==options.boardWidth-1){
					float='';
					board += '<div id="'+r+'-b" style="border-collapse: collapse;overflow: hidden;'+float+' width: '+options.cellsize+'px; height: '+options.cellsize+'px;border: solid white;border-width: 1px;color: #FFFFFFFF; background: #FFFFFF;"></div>';					
				}
			}			
			//board += '</tr>';
			//board += '<div style="clear:both;" />';				
		}
		//board += '</table>';		
		world.append(board);				
		lifeBegin(options.boardWidth,options.boardHeight,lifedata,options.timeout); 
		return this.each(function() {			
		});
	};
})(jQuery);

var ciclo = 1;
function lifeBegin(boardWidth,boardHeight,lifedata,timeout){	
	newlifedata = lifeChangeStatus(r,c,boardWidth,boardHeight,lifedata);				
	for (r=0; r<boardHeight; r++){					
		for (c=0; c<boardWidth; c++){															
			lifeRepaint(r,c,lifedata,newlifedata);																		
		}									
	}
	lifedata = newlifedata;
	newlifedata = null;
	$('.lifestatus').html(ciclo);
	ciclo = ciclo + 1;
	setTimeout (function() { lifeBegin(boardWidth,boardHeight,lifedata,timeout); }, timeout);	
}

function lifeRepaint(r,c,lifedata,newlifedata){
	if (lifedata[r][c] != newlifedata[r][c]){
		if (newlifedata[r][c] == 1){
			$('#'+r+'-'+c+'').css('background','#000000');	
		}
		else{
			$('#'+r+'-'+c+'').css('background','#FFFFFF');		
		}
	}
}

function lifeChangeStatus(r,c,boardWidth,boardHeight,lifedata){
	//nace una célula si tiene 3 células vecinas vivas, sigue viva si tiene 2 o 3 células vecinas vivas y muere en otro caso
	var newlifedata = new KArray2D(boardWidth,boardHeight);
	for (r=0; r<boardHeight; r++){					
		for (c=0; c<boardWidth; c++){			
			if (c==0) newlifedata[r] = new Array(boardWidth);																	
			newlifedata[r][c] = getNewStatus(r,c,boardWidth,boardHeight,lifedata);																		
		}							
	}
	return newlifedata;	
}

function getNewStatus(r,c,boardWidth,boardHeight,lifedata){
	var alives = 0;
	if (r==0){	
		if (c==0){
			alives += lifedata[r][c+1];
			alives += lifedata[r+1][c+1];
			alives += lifedata[r+1][c];			
		}
		else if (c==boardWidth-1){
			alives += lifedata[r][c-1];
			alives += lifedata[r+1][c-1];
			alives += lifedata[r+1][c];
		}
		else{
			alives += lifedata[r][c+1];
			alives += lifedata[r+1][c+1];
			alives += lifedata[r+1][c];
			alives += lifedata[r][c-1];
			alives += lifedata[r+1][c-1];			
		}
	}
	else if (r==boardHeight-1){
		if (c==0){
			alives += lifedata[r][c+1];
			alives += lifedata[r-1][c+1];
			alives += lifedata[r-1][c];
		}
		else if (c==boardWidth-1){
			alives += lifedata[r][c-1];
			alives += lifedata[r-1][c-1];
			alives += lifedata[r-1][c];
		}
		else{
			alives += lifedata[r][c+1];
			alives += lifedata[r-1][c+1];
			alives += lifedata[r-1][c];
			alives += lifedata[r][c-1];
			alives += lifedata[r-1][c-1];
		}	
	}
	else{
		if (c==0){
			alives += lifedata[r-1][c];
			alives += lifedata[r-1][c+1];
			alives += lifedata[r][c+1];
			alives += lifedata[r+1][c+1];
			alives += lifedata[r+1][c];
		}
		else if (c==boardWidth-1){
			alives += lifedata[r-1][c];
			alives += lifedata[r-1][c-1];
			alives += lifedata[r][c-1];
			alives += lifedata[r+1][c-1];
			alives += lifedata[r+1][c];
		}
		else{
			alives += lifedata[r-1][c-1];
			alives += lifedata[r-1][c];
			alives += lifedata[r-1][c+1];
			alives += lifedata[r][c-1];
			alives += lifedata[r][c+1];
			alives += lifedata[r+1][c-1];
			alives += lifedata[r+1][c];
			alives += lifedata[r+1][c+1];
		}	
	} 
	
	if (lifedata[r][c]==0){
		if (alives == 3){			
			return 1;
		}
		else
			return 0;
	}
	else{
		if (alives != 2 && alives != 3)
			return 0;
		else
			return 1;			
	}
}

function KArray2D(NumOfRows,NumOfCols){
	var k=new Array(NumOfRows);
	for (i = 0; i < k . length; ++ i)
		k [i] = new Array (NumOfCols);	
	return k;
}

console.log("game of life parsed at :"+ getLoadTime());
