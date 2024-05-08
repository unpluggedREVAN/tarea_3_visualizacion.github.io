import * as d3 from 'd3'
import * as makeNode from './archivos/classNode.js'


d3.csv('src/archivos/moduls.csv').then(data => {
    console.log(data)

    data = data.map(item => {
        return {
          id: item.pathname,
          size: item.size
        };
      });

    let rootNode = makeNode.convertToHierarchy(data,"moduloVue")
    var root =  d3.hierarchy(rootNode)


    const treeLayout = d3.cluster().size([360*6, 100*6]);
    treeLayout(root);
    const svg = d3.select('#radialM');

 // Dibuja los enlaces (líneas)
 console.log(root)
 svg.select('g.nodes')
 .selectAll('circle.node')
 .data(root.descendants())
 .enter()
 .append('circle')
 .classed('node', true)
 .attr('cx', 0)
 .attr('cy', d => -d.y)
 .attr('r', 5)
 .attr("fill", "red")
 .attr('stroke', "darkgray")
 .attr('stroke-width', 1)
 .attr("transform", d => `
     rotate(${d.x}, 0, 0)
 `)
 .text((d) => d.id)
 .style("font-size", "2000px");
 // Dibuja los nodos (círculos)
 var lineGen = d3.lineRadial()
  .angle(d => d.x * Math.PI / 180)
  .radius(d => d.y);

var linkGen =  d3.linkRadial()
  .angle(d => d.x * Math.PI / 180)
  .radius(d => d.y)

// draw links
svg.select('g.links')
  .selectAll('path.link')
  .data(root.links())
  .enter()
  .append("path")
  .classed('link', true)
  .attr('stroke', "darkgray")
  .attr('stroke-width', 2)
  .attr("d", linkGen)
  .attr("d", (d) => lineGen([d.target, d.source]))

svg.selectAll('.label')
  .data(root.descendants())
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('x', d => d.y + 10)
  .attr('y', d => d.x)
  .text(d => d.pathname);
//fin rad

//circle
root = d3.hierarchy(rootNode)
.sum(d => d.hasOwnProperty("size") ? d.size : 0)
.sort((a,b) => b.value - a.value);

var partition = d3.pack()
.size([900,900]);

partition(root);

d3.select("#circleM g")
.selectAll('circle.node')
.data(root.descendants())
.enter()
.append('circle')
.classed('node', true)
.attr('cx', d => d.x )
.attr('cy', d => d.y)
.attr('r', d => d.r)
.style("fill", "green") // aqui termina el circle


var root = d3.hierarchy(rootNode)
  .sum(d => d.hasOwnProperty("size") ? d.size : 0)
  .sort((a, b) => b.value - a.value);

var renderRect = function(id, tileMap) {

  var treemap = d3.treemap()
    .size([1440,900])
    .tile(tileMap)
    .paddingOuter(1);

  treemap(root);

  console.log(root.leaves())
  d3.select("#" + id)
    .selectAll('rect.node')
    .data(root.leaves())
    .enter()
    .append('rect')
    .classed('node', true)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr("fill", "steelblue");
};

renderRect("treemapM", d3.treemapSquarify); //fin squarify

var drawPartition = function() {
    let root = d3.hierarchy(rootNode)
    .count();
  
    let partition = d3.partition()
      .size([1440,1440]);
  
    partition(root);
  
    d3.select("#partitionM")
      .selectAll('rect.node')
      .data(root.descendants())
      .enter()
      .append('rect')
      .classed('node', true)
      .attr('x', d => d.x0)
      .attr('y', d => d.y0)
      .attr('width', d => d.x1 - d.x0 )
      .attr('height', d => d.y1 - d.y0 );
  };

    drawPartition();
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON:', error);
  });
