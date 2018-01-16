let learning_rate=0.05;
let perceptron;
let points=[];
let select;
let isPerceptronWorking;

function setup() {
	frameRate(10);
	createCanvas(windowWidth, windowHeight-50);
	select=createSelect();
	select.option("Green");
	select.option("Red");
	select.position(width/2-20,height+20);
	perceptron=new Perceptron();
	isPerceptronWorking=true;
//	createPoints();
}

function draw() {
	background(250);
	perceptron.draw();
	drawPoints();
	drawLine();
	if(!isPerceptronWorking){
		if(learning_rate>0.001){
			learning_rate*=0.9;
			perceptron.train(points);
		}else {
			learning_rate=0.05;
		}
		isPerceptronWorking=testPerceptron();
	}
}

function touchMoved(){
	if(select.value()=="Red"){
		select.value("Green");
	}else{
		select.value("Red");
	}
}

function mousePressed(){
	if(mouseX>0&&mouseX<width&&mouseY>0&&mouseY<height){
		let posx, posy, label;
		posx=map(mouseX,0,width,-1,1);
		posy=map(mouseY,0,height,1,-1);
		label=(select.value()=="Green"?1:-1);
		let point=new P(posx,posy,label);
		points.push(point);
		isPerceptronWorking=testPerceptron();
	}
}

function testPerceptron(){
	for(let p of points){
		if(perceptron.guess([p.x,p.y])!=p.label){
			return false;
		}
	}
	return true;
}

function f(x){
	return x;
}

function createPoints(){
	let posx, posy, label, p;
	for(let i=1; i<width; i+=50){
		for (let j= 1; j < height; j+=50) {
			posx=map(i,0,width,-1,1);
			posy=map(j,0,height,1,-1);
			if(posy>f(posx)){
				label=1;
			}else{
				label=-1;
			}
			points.push(new P(posx,posy,label));
		}
	}
}


function drawLine(){
	push();
	strokeWeight(2);
	stroke(200,255,0);
	let p1, p2;
	p1=new P(-1,perceptron.guessY(-1));
	p2=new P(1,perceptron.guessY(1));
	line(p1.pixelx,p1.pixely,p2.pixelx,p2.pixely);
	pop();
}

function drawPoints(){
	for(let p of points){
		p.draw();
	}
}

function P(x,y,label){
	this.x=x||random(-1,1);
	this.y=y||random(-1,1);
	this.label=label||perceptron.guess([this.x,this.y]);
	this.pixelx=map(this.x,-1,1,0,width);
	this.pixely=map(this.y,-1,1,height,0);

	this.draw=function(){
		fill(250);
		stroke(0);
		ellipse(this.pixelx,this.pixely,15,15);
		if(this.label==1){
			fill(0,255,0);
		}else{
			fill(255,0,0);
		}
		ellipse(this.pixelx,this.pixely,10,10);
	}
}


function Perceptron(n){
	this.n=n||3;
	this.weights=[];
	for(let i=0; i<this.n; i++){
		this.weights[i]=random(-1,1);
	}

	this.activation=function(val){
		if(val>=0){
			return 1;
		}else{
			return -1;
		}
	}

	this.guessY=function(x){
		return -1*(this.weights[0]+this.weights[1]*x)/this.weights[2];
	}

	// input be array of [x,y]
	this.guess=function(input){
		let sum=0;
		sum+=this.weights[0];
		for(let i=1; i<this.n; i++){
			sum+=(this.weights[i]*input[i-1]);
		}
		return this.activation(sum);
	}

	// training data be collection of points
	this.train=function(data){
		let guess, desired, error;
		for(let p of data){
			guess=this.guess([p.x,p.y]);
			desired=p.label;
			error=desired-guess;
			error*=learning_rate;
			this.weights[0]=this.weights[0]+error;
			this.weights[1]=this.weights[1]+error*p.x;
			this.weights[2]=this.weights[2]+error*p.y;
		}
	}

	this.draw=function(){
		push();
		noFill();
		stroke(10);
		strokeWeight(1);
		rectMode(CENTER);
		rect(width/2,height/2,100,60);
		translate(width/2,height/2);
		text("Perceptron",-30,0);
		text("Bias : "+nf(perceptron.weights[0],1,4),-150,-40);
		text("Weight X : "+nf(perceptron.weights[1],1,4),-150,0);
		text("Weight Y :"+nf(perceptron.weights[2],1,4),-150,40);
		text("Output",80,0);
		pop();
	}
}
