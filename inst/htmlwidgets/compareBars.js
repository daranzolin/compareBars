HTMLWidgets.widget({

  name: 'compareBars',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(opts) {
        
        const data = HTMLWidgets.dataframeToD3(opts.data);
        
        const svg = d3.select("div")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
        
        const cols = Object.keys(data[0]);
        const oc = cols[0];
        const c1 = cols[1];
        const c2 = cols[2];
        
        const margin = ({top: 80, right: 100, bottom: 50, left: 75});
        
        const y0 = d3.scaleLinear()
              .domain([0, d3.max(data, d => Math.max(d[c1], d[c2])) ])
              .range([height - margin.bottom, margin.top]);
              
        const x0 = d3.scaleBand()
              .domain(data.map(d => d[oc]))
              .range([margin.left, width - margin.right])
              .padding(0.1);
              
        const xAxis = g => g
              .style("font-size", "18px")
              .attr("transform", `translate(0,${height - margin.bottom})`)
              .call(g => g.append("g")
              .call(d3.axisBottom(x0)))
              .call(g => g.selectAll(".domain").remove());
        
        const yAxis = g => g
              .attr("transform", `translate(${margin.left},0)`)
              .call(d3.axisLeft(y0)
                  .tickValues(d3.scaleLinear()
                  .domain(y.domain())
                  .ticks()))
              .call(g => g.selectAll(".tick line")
                  .clone()
                  .attr("stroke-opacity", 0.2)
                  .attr("x2", width - margin.left - margin.right))
              .call(g => g.select(".domain").remove());
              
        svg.append("g").call(yAxis);
  
        svg.append("g")			
              .attr("class", "grid")
              .attr("transform", `translate(${margin.left}, 0)`)
              .attr("stroke", "lightgrey")
              .attr("stroke-opacity", 0.5)
              .attr("stroke-width", 0.3);
      
  
        svg.append("g") 
              .attr("fill", "#ddd")
              .selectAll("rect")
              .data(data)
                .enter().append("rect")
                  .attr("x", d => x0(d[oc]))
                  .attr("y", d => y0(Math.min(d[c1], d[c2])))
                  .attr("width", x.bandwidth())
                  .attr("height", d => y0(0) - y0(Math.min(d[c1], d[c2]))) ;
            
            
          svg.append("g")
              .selectAll("rect")
              .data(data)
                .enter().append("rect")
                  .attr("fill", d => d[c1] < d[c2] ? fillCol1 : fillCol2)
                  .attr("y", d => y0(Math.max(d[c1], d[c2])))
                  .attr("x", d => x0(d[oc]))
                  .attr("width", x0.bandwidth())
                  .attr("height", d => y0(Math.min(d[c1], d[c2])) - y0(Math.max(d[c1], d[c2]))); 
  
          svg.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .style("font", "11px sans-serif")
              .attr("x", width - margin.left)
              .attr("y", height - margin.bottom/4)
              .text(xLabel);
 
           svg.append("text")
              .attr("class", "y label")
              .attr("text-anchor", "end")
              .style("font", "11px sans-serif")
              .attr("dy", ".85em")
              .attr("dx", "-5em")
              .attr("transform", "rotate(-90)")
              .text(yLabel);
  
            svg.append("text")
                  .attr("x", margin.left)             
                  .attr("y", margin.top / 3)
                  .attr("text-anchor", "left") 
                  .style("font-family", "sans-serif")
                  .style("font-size", "20px")
                  .style("font-weight", "bold")
                  .text(titleLabel);
  
            svg.append("text")
                .attr("x", margin.left)             
                .attr("y", margin.top - (margin.top)/4)
                .attr("text-anchor", "left") 
                .style("font-family", "sans-serif")
                .style("font-size", "14px")
                .text(subtitleLabel);
  
            svg.append("rect") 
                .style("fill", fillCol1)
                .attr("x", width - (margin.left))
                .attr("y", height/4)
                .attr("width", 17)
                .attr("height", 17);
  
            svg.append("rect") 
              .style("fill", fillCol2)
              .attr("x", width - (margin.left))
              .attr("y", (height/4) - 20)
              .attr("width", 17)
              .attr("height", 17);
  
            svg.append("text")
                .style("font-family", "sans-serif")
                .style("font-size", "14px")//col1 text
                .attr("x", width - (margin.left) + 25)
                .attr("y", (height/4) - 6)
                 .text(`${c1} >`);
  
            svg.append("text") //col2 box
              .style("font-family", "sans-serif")
              .style("font-size", "14px")
              .attr("x", width - (margin.left) + 25)
              .attr("y", (height/4) + 13)
              .text(`${c2} >`);
        
            svg.append("g").call(xAxis);

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});