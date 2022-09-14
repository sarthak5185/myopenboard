let canvas=document.querySelector("canvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let tool=canvas.getContext("2d");//api

tool.strokeStyle="blue"; // color of the line


tool.beginPath(); // new graphic (path) line
tool.moveTo(0, 0); // source point from where to startline
tool.lineTo(300, 150);// dest point to where line to be drawn
tool.stroke();// draw the line