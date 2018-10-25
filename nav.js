

var pTo;
var pFrom;
var map;//=setUpMaze(points,23,25);
var w=25;
var h=25;
var mapx=1400;
var mapy=1000;
var canvas;
var myPath;
var lastDelt=[0,0];
var boarderWid=1;
var sizeConfigs={
	pc:{
		squares:30,
		boarder:1,
		mapDims:{
			x:700,
			y:500
		}
	},
	phone:{
		squares:55,
		boarder:5,
		mapDims:{
			x:1400,
			y:1000
		}
	},
	tab:{
		squares:60,
		boarder:5,
		mapDims:{
			x:1400,
			y:1000
		}
	}
};
//mapHTML(map)
//2
//1
function setUp(){
	getDeviceRats();
	createCanvas();
	uptRooms();
	makeDest();
	$(".selFrom").change(uptRooms);
	
}
function doShifts(b,f){
	if(b==1){
	points=shift(1,-6,points);
	points=shift(0,-10,points);
	places=shiftObj(1,-6,places);
	places=shiftObj(0,-10,places);
	}
	if(b==2){
	points=shift(1,-2,points);
	points=shift(0,-9,points);
	places=shiftObj(1,-2,places);
	places=shiftObj(0,-9,places);
	}
	if(b==3){
		if(f==2){
	points=shift(1,-6,points);
	points=shift(0,-10,points);
	places=shiftObj(1,-6,places);
	places=shiftObj(0,-10,places);
		}else{
	points=shift(1,-6,points);
	points=shift(0,-6,points);
	places=shiftObj(1,-6,places);
	places=shiftObj(0,-6,places);
		}
	}
	console.log(printArr(points));
}
function printArr(arr){
	var str="";
	for(var i=0;i<arr.length;i++){
		if(i==0){
			str+="[";
		}
		for(var j=0;j<arr[i].length;j++){
			if(j==0){
			str+="[";
			}
			str+=arr[i][j]
			if(j!=arr[i].length-1){
				str+=",";
			}else{
				str+="]";
			}
		}
		if(i!=arr.length-1){
				str+=",";
			}else{
				str+="]";
			}
	}
	return str;
}
function unshift(b,f){
	if(b==1){
	points=shift(1,6,points);
	points=shift(0,10,points);
	places=shiftObj(1,6,places);
	places=shiftObj(0,10,places);
	}
	if(b==2){
	points=shift(1,2,points);
	points=shift(0,9,points);
	places=shiftObj(1,2,places);
	places=shiftObj(0,9,places);
	}
	if(b==3){
		if(f==2){
	points=shift(1,6,points);
	points=shift(0,10,points);
	places=shiftObj(1,6,places);
	places=shiftObj(0-10,places);
		}else{
	points=shift(1,6,points);
	points=shift(0,6,points);
	places=shiftObj(1,6,places);
	places=shiftObj(0,6,places);
		}
	}
}
var dests=[];
function go(){
	var holder=placesFromHTML();
	dests=holder;
	console.log(dests);
	var froLoc=getLoc(holder[0]);
	var to=getLoc(holder[1]);
	var builds=Object.keys(maps);
	var floors=Object.keys(maps[builds[parseInt(holder[0].substring(0,1))-1]]);
	points=maps[builds[parseInt(holder[0].substring(0,1))-1]][floors[parseInt(holder[0].substring(2,3))-1]];
	if(!((""+holder[0]+"").substring(0,1)===(""+holder[1]+"").substring(0,1))){
		buildingAlert((""+holder[1]+"").substring(0,1));
	}else if(!((""+holder[0]+"").substring(2,3)===(""+holder[1]+"").substring(2,3))){
		floorAlert((""+holder[1]+"").substring(2,3));
	}else{
	isDest(holder[0],holder[1])
	lastDelt[0]=parseInt(holder[0].substring(0,1));
	lastDelt[1]=parseInt(holder[0].substring(2,3));
	//doShifts(lastDelt[0],lastDelt[1]);
	map=setUpMaze(points,23,25);
	$("#key").replaceWith("<div id='key'class='info'><span class='key1'>Your location </span><span class='key2'>Your destination </span><span class='key3'>Your path</span></div>");
		mapHTML(map);
	getPath(map,froLoc[0],froLoc[1],to[0],to[1],function(data){
		drawPath(data);
		myPath=data;
		displayDirec(makeStepDirect(data));
	//unshift(lastDelt[0],lastDelt[1]);
	});}
}
var testPt=[];
var isAlert=false;
var updated=[];
function placesFromHTML(){
	//console.log([document.getElementById("spefLocSel").value,document.getElementById("spefToSel").value]);
	if(isAlert){
		isAlert=false;
		return updated;
	}
	return [document.getElementById("spefLocSel").value,document.getElementById("spefToSel").value];
}
function getExit(b){
	b=b-1;
	var builds=Object.keys(places);
	var buildSpef=places[builds[b]];
	var floors=Object.keys(buildSpef);
	var roomSpef=buildSpef[floors[0]];
	var rooms=Object.keys(roomSpef);
	for(var i=0; i<rooms.length;i++){
		if(roomSpef[rooms[i]].en&&roomSpef[rooms[i]].en.indexOf("Exit")>-1){
			return roomSpef[rooms[i]].id;
		}
	}
	return dests[0];
}
function floorAlert(floor){
	var suf="";
	floor=parseInt(floor);
	if(1==floor){
		suf="st";
	}
	if(2==floor){
		suf="nd";
	}
	if(3==floor){
		suf="rd";
	}
	floor=floor+suf;
	var str="JCPS believes that revealing the location of stairwells may pose a security threat. Therefore, this program cannot"
	+"help you navigate to the "+floor+" floor. Please, find your own way to the "+floor+" floor. Then begin mapping.";
	alert(str);
}
function buildingAlert(building){
	building=parseInt(building);
	var hold="";
	var placeLoc=0;
	if(1==building){
		hold="Manual";
	}
	if(2==building){
		hold="YPAS";
		placeLoc=1;
	}
	if(3==building){
		hold="YPAS Sam Meyers";
		placeLoc=2;
	}
	building=hold;
	var str="Unfortunately, your destination is in another building, please use the directions to the exit "+
	"then the volunteers will help you to navigate to the"+building+". Then please resume using this application once inside the "+building+" building.";
	alert(str);
	isAlert=true;
	updated=[dests[0],getExit(parseInt((""+dests[0]).substring(0,1)))];
	go();
}
function createCanvas(){
	canvas = document.createElement('canvas');
	canvas.width  = mapx;
    canvas.height = mapy;
	document.getElementById('map').appendChild(canvas);
	
}
function getDeviceRats(){
	var screenWid=screen.availWidth;
	var screenH=screen.availHeight;
	if(screenWid>1000&&screenH<1000){
		boarderWid=sizeConfigs.pc.boarder;
		w=sizeConfigs.pc.squares;
		h=w;
		mapx=sizeConfigs.pc.mapDims.x;
		mapy=sizeConfigs.pc.mapDims.y;
	}else if(screenWid>700&&screenH>1000){
		boarderWid=sizeConfigs.tab.boarder;
		w=sizeConfigs.tab.squares;
		h=w;
		mapx=sizeConfigs.tab.mapDims.x;
		mapy=sizeConfigs.tab.mapDims.y;
	}else{
		boarderWid=sizeConfigs.phone.boarder;
		w=sizeConfigs.phone.squares;
		h=w;
		mapx=sizeConfigs.phone.mapDims.x;
		mapy=sizeConfigs.phone.mapDims.y;
	}
}
function shift(index, val, coords){
	for(var i=0;i<coords.length;i++){
		coords[i][index]=coords[i][index]+val;
	}
	return coords
}
function shiftObj(index,val,obj){
	console.log(obj);
	var keys=Object.keys(obj);
	for(var i=0;i<keys.length;i++){
		var subKeys=Object.keys(obj[keys[i]]);
		for(var j=0;j<subKeys.length;j++){
			var subKeys2=Object.keys(obj[keys[i]][subKeys[j]]);
			for(var k=0;k<subKeys2.length;k++){
				 obj[keys[i]][subKeys[j]][subKeys2[k]].loc[index]=obj[keys[i]][subKeys[j]][subKeys2[k]].loc[index]+val;
			}
		}
	}
	return obj;
}

function mapHTML(matrix){
    var context = canvas.getContext('2d');
	var it=10;
	console.log(h,w)
	for(var i=0;i<matrix.length;i++){
		for(var j=0;j<matrix.length;j++){
			var color='#b9bdbf ';
			var colorB="#8b3a3a";
			if(matrix[i][j]==0){
				color="white";
				colorB="#66a366";
			}
			context.beginPath();
			context.rect(j*h, i*w, w, h);
			context.fillStyle = color;
			context.fill();
			context.lineWidth = boarderWid;
			context.strokeStyle = colorB;
			context.stroke();
		}
	}
}
function isDest(to,fr){
	if(to===fr){
		alert("You destination is your current location");
	}
}
function drawPath(path){
    var context = canvas.getContext('2d');
	var it=10;
	for(var i=0;i<path.length;i++){
		var color="#23e758";
		if(i==0){
			color="green";
		}
		if(i==path.length-1){
			color="red";
		}
		context.beginPath();
			context.rect(path[i].x*h, path[i].y*w, w, h);
			context.fillStyle = color;
			context.fill();
			context.lineWidth = 5;
			context.strokeStyle = "black";
			context.stroke();
	}
}

function setUpMaze(arr,n1,n2){
	var maze=[];
	var inc=0;
	for(var i=0;i<n1;i++){
		var row=[];
		var found=false;
		for(var j=0;j<n2;j++){
			for(var k=0;k<arr.length;k++){
				if(arr[k][0]==i&&arr[k][1]==j){
					found=true;
					//console.log(arr[k],i,j);
					break;
				}
				
			}
			if(found){
				row.push(0);
				inc++;
				found=false;
			}else{
				row.push(1);
			}
			
		}
		maze.push(row);
	}
	console.log(inc);
	
	return maze;
	
}
function getLoc(roomID){
	var keys=Object.keys(places);
	for(var i=0;i<keys.length;i++){
		var subKeys=Object.keys(places[keys[i]]);
		for(var j=0;j<subKeys.length;j++){
			var subKeys2=Object.keys(places[keys[i]][subKeys[j]]);
			for(var k=0;k<subKeys2.length;k++){
				if(roomID===places[keys[i]][subKeys[j]][subKeys2[k]].id){
					return places[keys[i]][subKeys[j]][subKeys2[k]].loc;
				}
			}
		}
	}
	return [14,22,0];
}

function getPath(matrix,x1,y1,x2,y2,callback){
	var easystar = new EasyStar.js();
	easystar.setGrid(matrix);
	easystar.setAcceptableTiles([0]);
	easystar.findPath(y1, x1, y2, x2, function( path ) {
	if (path === null) {
		console.log("Path was not found.");
	} else {
		console.log(path);
		callback(path);
	}
	});
	easystar.calculate();
}
var mat=[[0,0],[0,0]];

function makeStepDirect(direc){
	var steps=[];
	for(var i=1;i<direc.length-1;i++){
		if(direc[i-1]&&direc[i+1]){
			if(direc[i-1].x==direc[i].x&&direc[i-1].y!=direc[i].y||direc[i-1].x!=direc[i].x&&direc[i-1].y==direc[i].y){
				if(!(steps[steps.length-1]==="Proceed straight")){
					steps.push("Proceed straight");
				}
			}
			if((direc[i-1].x!=direc[i].x&&direc[i].y!=direc[i+1].y)){
					if(direc[i].y-direc[i+1].y>0){
						steps.push("turn left");
					}else{
						steps.push("turn right");
					}
			}
			if((direc[i-1].y!=direc[i].y&&direc[i].x!=direc[i+1].x)){
					console.log(7)
					if(direc[i].x-direc[i+1].x<0){
						console.log(8)
						steps.push("turn right");
					}else{
						steps.push("turn left");
					}
			}
		}
	}
	return steps;
}
function displayDirec(dir){
	$("#StepStep").replaceWith("<div id='StepStep'></div>");
	var html = "<div id='StepStep'><div id='init'class='direct"+i%2+"'>Turn by turn directions </div>";
		for(var i=0;i<dir.length;i++){
			html+="<div class='direct"+i%2+"'>"+dir[i]+"</div>";
		}
	html+="</div>";
	$("#map").after(html);
}

var uptRooms=function(){
	$("#spefLoc").replaceWith("<div id='spefLoc'></div>")
	var b=parseInt(document.getElementById("buildSelF").value);
	var f=parseInt(document.getElementById("floorSelF").value);
	var builds=Object.keys(places);
	var floors=Object.keys(places[builds[b-1]]);
	var roomSpef=places[builds[b-1]][floors[f-1]];
	var roomKeys=Object.keys(roomSpef);
	var html="<label for='spefLocSel'>Input your current location:</label><select id='spefLocSel'>";
		for(var i=0;i<roomKeys.length;i++){
			
			if((""+roomKeys[i]).indexOf("roomCluster")>-1){
				for(var j=0;j<roomSpef[roomKeys[i]].rooms.length;j++){
					html+="<option value="+roomSpef[roomKeys[i]].id+">"+roomSpef[roomKeys[i]].rooms[j]+"</option>";
				}
			}else{
				if(roomSpef[roomKeys[i]].en.length>0){
				html+="<option value="+roomSpef[roomKeys[i]].id+">"+roomSpef[roomKeys[i]].en+"</option>";}
			}
		}
	
	html+="</select>";
	$("#spefLoc").append(html);
	
}
function makeDest(){
	$("#to").replaceWith("<div id='to'></div>")
	var builds=Object.keys(places);
	var html="<label for='spefToSel'>Input your destination:</label><select id='spefToSel' >";
	for(var k=0;k<builds.length;k++){
		var floors=Object.keys(places[builds[k]]);
	for(var f=0;f<floors.length;f++){
		var roomSpef=places[builds[k]][floors[f]];
		//console.log(roomSpef,builds,builds[k],k,floors[f],f)
		var roomKeys=Object.keys(roomSpef);
		for(var i=0;i<roomKeys.length;i++){
			
			if((""+roomKeys[i]).indexOf("roomCluster")>-1){
				/*for(var j=0;j<roomSpef[roomKeys[i]].rooms.length;j++){
					html+="<option value="+roomSpef[roomKeys[i]].id+">"+roomSpef[roomKeys[i]].rooms[j]+"</option>";
				}*/
			}else{
				if(roomSpef[roomKeys[i]].en&&roomSpef[roomKeys[i]].en.length>0){
				html+="<option value="+roomSpef[roomKeys[i]].id+">"+roomSpef[roomKeys[i]].en+"</option>";}
			}
		}
	}}
	html+="</select>";
	$("#to").append(html);
}
//on change select id
/*
/*console.log(map,map[getLoc(1.1)[0]][getLoc(1.1)[1]],map[getLoc(1.5)[0]][getLoc(1.5)[1]])
getPath(map,getLoc(1.1)[0],getLoc(1.1)[1],getLoc(1.5)[0],getLoc(1.5)[1],function(data){
	console.log(data);
	myPath=data;
});*/


