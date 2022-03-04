const req = new XMLHttpRequest()
req.open('GET', 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json', true)
req.onload = () => {
  const dataSet = JSON.parse(req.responseText)
  
  generateTreemap(dataSet)
  generateTiles(dataSet)
  generateLegend(dataSet)
}
req.send()

//global variables
const w = 800
const h = 600
let tiles
const categoriesAndColors =[
  {
    category: 'Wii',
    color: '#1f77b4'
  },
  {
    category: 'GB',
    color: '#aec7e8'
  },
  {
    category: 'PS2',
    color: '#ff7f0e'
  },
  {
    category: 'SNES',
    color: '#ffbb78'
  },
  {
    category: 'GBA',
    color: '#2ca02c'
  },
  {
    category: '2600',
    color: '#98df8a'
  },
  {
    category: 'DS',
    color: '#d62728'
  },
  {
    category: 'PS3',
    color: '#ff9896'
  },
  {
    category: '3DS',
    color: '#9467bd'
  },
  {
    category: 'PS',
    color: '#c5b0d5'
  },
  {
    category: 'XB',
    color: '#8c564b'
  },
  {
    category: 'PSP',
    color: '#c49c94'
  },
  {
    category: 'X360',
    color: '#e377c2'
  },
  {
    category: 'NES',
    color: '#f7b6d2'
  },
  {
    category: 'PS4',
    color: '#7f7f7f'
  },
  {
    category: 'N64',
    color: '#c7c7c7'
  },
  {
    category: 'PC',
    color: '#bcbd22'
  },
  {
    category: 'XOne',
    color: '#dbdb8d'
  }  
]

const getColor = (category) => {
  // could change it to use filter instead of loops and ifs
    for (let i = 0; i < categoriesAndColors.length; i++) {
      if(category == categoriesAndColors[i].category) {
        return categoriesAndColors[i].color
      }        
    }
  }  

const generateTreemap = (dataSet) => { 
  
  const hierarchy = d3.hierarchy(dataSet,  node => node.children)
                      .sum(node => node.value)
                      .sort((previousNode, currentNode) => currentNode.value - previousNode.value)
 
  const treemap = d3.treemap()
                    .size([w, h]) 
  
  //here I defined the tiles, which are the leaves of the treemap. Then added to these tiles the color property, which is based on the category property.
  treemap(hierarchy)
  tiles = hierarchy.leaves() 
  tiles = tiles.map((t, i) => ({
    ...t,
    color: getColor(tiles[i].data.category)
  }))
}

const generateTiles = (dataSet) => {
  const tooltip = document.querySelector('#tooltip')
  
  const treemapCanvas = d3.select('#treemap-canvas')
                          .attr('width', w)
                          .attr('height', h)
                            .selectAll('g')
                            .data(tiles)
                            .enter()
                            .append('g')
                            .attr('transform', t => 'translate(' + t.x0 + ', ' + t.y0 + ')')
  
          treemapCanvas.append('rect')
                       .attr('class', 'tile')
                       .attr('data-name', t => t.data.name)
                       .attr('data-category', t => t.data.category)
                       .attr('data-value', t => t.data.value)
                       .attr('fill', t => t.color)
                       .attr('width', t => t.x1 - t.x0)
                       .attr('height', t => t.y1 - t.y0)
                       .style("stroke", "black")
                       .on('mouseover', (e, t, i) => {
                              tooltip.classList.add('visible')
                              tooltip.setAttribute('data-value', t.value)                              
                              tooltip.style.left = e.pageX + 'px'
                              tooltip.style.top = e.pageY + 'px'
                              tooltip.innerHTML = (`
                                <p>Name: ${t.data.name}</p>
                                <p>Category: ${t.data.category}</p>
                                <p>Value: ${t.data.value}</p>`)
                            })
                       .on('mouseout', () => tooltip.classList.remove('visible'))
  
          treemapCanvas.append('text')
                       .selectAll('tspan')
                       .data(t => t.data.name.split(/(?=[A-Z][^A-Z])/g)) //this regex is not 100%
                       .enter()
                       .append('tspan')                       
                         .text(t => t)
                         .style('font-size', '10px')
                         .attr('x', 6)
                         .attr('y', (t, i) => 15 + i * 15)
                         .on('mouseover', () => tooltip.classList.add('visible'))
                         .on('mouseout', () => tooltip.classList.remove('visible'))
                       
}

const generateLegend = (dataSet) => {
  const legendWidth = 100
  const legendHeight = h
  const squareSize = 20
  
  const legendCanvas = d3.select('#legend')
                         .attr('width', legendWidth)
                         .attr('height', legendHeight)
                           .selectAll('g')
                           .data(categoriesAndColors)
                           .enter()
                           .append('g')
  
          legendCanvas.append('rect')
                      .attr('class', 'legend-item')
                      .attr('data-name', d => d.category)
                      .attr('fill', d => d.color)
                      .attr('width', squareSize)
                      .attr('height', squareSize)
                      .attr('x', squareSize)
                      .attr('y', (_, i) => i * 30 + 32)
  
          legendCanvas.append('text')
                      .text(d => d.category)
                      .attr('x', squareSize * 2 + 4)
                      .attr('y', (_, i) => i * 30 + 49)
}