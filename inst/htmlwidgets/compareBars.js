HTMLWidgets.widget({

  name: 'compareBars',

  type: 'output',

  factory: function(el, width, height) {

    // TODO: define shared variables for this instance

    return {

      renderValue: function(opts) {

        const data = HTMLWidgets.dataframeToD3(opts.data);

        const svg = d3.select(el)
                    .append("svg")
                    .style("width", "100%")
                    .style("height", "100%");

        const cols = Object.keys(data[0]);
        const oc = cols[0];
        const c1 = cols[1];
        const c2 = cols[2];

        const margin = ({top: 80, right: 120, bottom: 50, left: 100});

        if (opts.settings.orientation === 'vertical') {

        let y0 = d3.scaleLinear()
              .domain([0, d3.max(data, d => Math.max(d[c1], d[c2]))]).nice()
              .range([height - margin.bottom, margin.top]);

        let x0 = d3.scaleBand()
              .domain(data.map(d => d[oc]))
              .range([margin.left, width - margin.right])
              .padding(0.1);

        let xAxis = g => g
              .style("font-size", "18px")
              .attr("transform", `translate(0,${height - margin.bottom})`)
              .call(g => g.append("g")
              .call(d3.axisBottom(x0)))
              .call(g => g.selectAll(".domain").remove());

        let yAxis = g => g
              .attr("transform", `translate(${margin.left},0)`)
              .call(d3.axisLeft(y0)
                  .tickValues(d3.scaleLinear()
                  .domain(y0.domain())
                  .ticks()).tickFormat(d3.format(opts.settings.axisFormat)))
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
              .attr("fill", opts.settings.minFillColor)
              .selectAll("rect")
              .data(data)
                .enter().append("rect")
                  .attr("x", d => x0(d[oc]))
                  .attr("y", d => y0(Math.min(d[c1], d[c2])))
                  .attr("width", x0.bandwidth())
                  .attr("height", d => y0(0) - y0(Math.min(d[c1], d[c2])));

          svg.append("g")
              .selectAll("rect")
              .data(data)
              .enter().append("rect")
              .attr("fill", d => d[c1] < d[c2] ? opts.settings.compareVarFill1 : opts.settings.compareVarFill2)
                  .attr("y", d => y0(Math.max(d[c1], d[c2])))
                  .attr("x", d => x0(d[oc]))
                  .attr("width", x0.bandwidth())
                  .attr("height", d => y0(Math.min(d[c1], d[c2])) - y0(Math.max(d[c1], d[c2])));

          let tip = d3.tip()
              .attr('class', 'd3-tipV')
              .offset([-10, 0])
              .html(function(d) {
                return `<span style='color:${d[c1] < d[c2] ? opts.settings.compareVarFill1 : opts.settings.compareVarFill2}'> ${d3.format(opts.settings.tooltipFormat)(Math.abs(d[c1] - d[c2]))}</span>`;
              });

        svg.call(tip);

          svg.append("g")
              .style("opacity", 0)
              .selectAll("rect")
              .data(data)
                .enter().append("rect")
                  .attr("x", d => x0(d[oc]))
                  .attr("y", d => y0(Math.max(d[c1], d[c2])))
                  .attr("width", x0.bandwidth())
                  .attr("height", d => y0(0) - y0(Math.max(d[c1], d[c2])))
                  .on('mouseover', tip.show)
                  .on('mouseout', tip.hide);

          svg.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .style("font", `11px ${opts.settings.fontFamily}`)
              .attr("x", width - margin.left)
              .attr("y", height - margin.bottom/4)
              .text(opts.settings.xLabel);

           svg.append("text")
              .attr("class", "y label")
              .attr("text-anchor", "end")
              .style("font", "11px sans-serif")
              .attr("dy", ".85em")
              .attr("dx", "-5em")
              .attr("transform", "rotate(-90)")
              .text(opts.settings.yLabel);

            svg.append("text")
                  .attr("x", margin.left)
                  .attr("y", margin.top / 3)
                  .attr("text-anchor", "left")
                  .style("font-family", `${opts.settings.fontFamily}`)
                  .style("font-size", "20px")
                  .style("font-weight", "bold")
                  .text(opts.settings.titleLabel);

            svg.append("text")
                .attr("x", margin.left)
                .attr("y", margin.top - (margin.top)/4)
                .attr("text-anchor", "left")
                .style("font-family", `${opts.settings.fontFamily}`)
                .style("font-size", "14px")
                .text(opts.settings.subtitleLabel);

            svg.append("rect")
                .style("fill", opts.settings.compareVarFill1)
                .attr("x", width - (margin.left))
                .attr("y", height/4)
                .attr("width", 17)
                .attr("height", 17);

            svg.append("rect")
              .style("fill", opts.settings.compareVarFill2)
              .attr("x", width - (margin.left))
              .attr("y", (height/4) - 20)
              .attr("width", 17)
              .attr("height", 17);

            svg.append("text")
                .style("font-family", `${opts.settings.fontFamily}`)
                .style("font-size", "14px")
                .attr("x", width - (margin.left) + 25)
                .attr("y", (height/4) - 6)
                .text(`${c1} >`);

            svg.append("text")
              .style("font-family", `${opts.settings.fontFamily}`)
              .style("font-size", "14px")
              .attr("x", width - (margin.left) + 25)
              .attr("y", (height/4) + 13)
              .text(`${c2} >`);

            svg.append("g").call(xAxis);

        } else {

          let x0 = d3.scaleLinear()
                  .domain([0, d3.max(data, d => Math.max(d[c1], d[c2]))]).nice()
                  .range([margin.left, width - margin.right]);

          let y0 = d3.scaleBand()
                  .domain(data.map(d => d[oc]))
                  .range([height - margin.bottom, margin.top])
                  .padding(0.1);

          let xAxis = g => g
                  .attr("transform", `translate(0,${height - margin.bottom})`)
                  .call(g => g.append("g"))
                  .call(d3.axisBottom(x0)
                      .tickFormat(d3.format(opts.settings.axisFormat)))
                  .call(g => g.selectAll(".domain").remove())
                  .call(g => g.selectAll(".tick line")
                    .clone()
                      .attr("stroke-opacity", 0.2)
                      .attr("y2", -height + margin.top + margin.bottom))
                  .call(g => g.select(".domain").remove());

          let yAxis = g => g
                  .attr("transform", `translate(${x0(0)},0)`)
                  .call(d3.axisLeft(y0).ticks(10))
                  .call(g => g.selectAll(".tick:last-of-type text")
                      .clone()
                      .attr("dy", "-1.1em")
                      .style("font-weight", "bold"));

          svg.append("g")
              .call(xAxis);

            //Legend box
            svg.append("rect")
                .style("fill", opts.settings.compareVarFill1)
                .attr("x", width - (margin.left))
                .attr("y", height/4)
                .attr("width", 17)
                .attr("height", 17);

            let tip = d3.tip()
              .attr('class', 'd3-tipH')
              .direction('e')
              .offset([0, 10])
              .html(function(d) {
                return `<span style='color:${d[c1] < d[c2] ? opts.settings.compareVarFill1 : opts.settings.compareVarFill2}'> ${d3.format(opts.settings.tooltipFormat)(Math.abs(d[c1] - d[c2]))}</span>`;
              });

        svg.call(tip);

          //Min fill bar
          svg.append("g")
              .attr("fill", opts.settings.minFillColor)
            .selectAll("rect")
            .data(data)
            .enter().append("rect")
              .attr("x", x0(0))
              .attr("y", d => y0(d[oc]))
              .attr("width", d => x0(Math.min(d[c1], d[c2])) - x0(0))
              .attr("height", d => y0.bandwidth());

            svg.append("g")
              .selectAll("rect")
              .data(data)
              .enter().append("rect")
                .attr("fill", d => d[c1] < d[c2] ? opts.settings.compareVarFill1 : opts.settings.compareVarFill2)
                .attr("x", d => x0(Math.min(d[c1], d[c2])))
                .attr("y", d => y0(d[oc]))
                .attr("width", d => x0(Math.max(d[c1], d[c2])) - x0(Math.min(d[c1], d[c2])))
                .attr("height", d => y0.bandwidth());

            svg.append("g")
              .style('opacity', 0)
            .selectAll("rect")
            .data(data)
            .enter().append("rect")
              .attr("x", x0(0))
              .attr("y", d => y0(d[oc]))
              .attr("width", d => x0(Math.max(d[c1], d[c2])) - x0(0))
              .attr("height", d => y0.bandwidth())
              .on('mouseover', tip.show)
              .on('mouseout', tip.hide);


            //Legend box
            svg.append("rect")
              .style("fill", opts.settings.compareVarFill2)
              .attr("x", width - (margin.left))
              .attr("y", (height/4) - 20)
              .attr("width", 17)
              .attr("height", 17);


            //Title label
            svg.append("text")
                  .attr("x", margin.left)
                  .attr("y", margin.top / 3)
                  .attr("text-anchor", "left")
                  .style("font-family", `${opts.settings.fontFamily}`)
                  .style("font-size", "20px")
                  .style("font-weight", "bold")
                  .text(opts.settings.titleLabel);

            svg.append("text")
              .attr("class", "x label")
              .attr("text-anchor", "end")
              .style("font", `11px ${opts.settings.fontFamily}`)
              .attr("x", width - margin.left)
              .attr("y", height - margin.bottom/4)
              .text(opts.settings.xLabel);

           svg.append("text")
              .attr("class", "y label")
              .attr("text-anchor", "end")
              .style("font", "11px sans-serif")
              .attr("dy", ".85em")
              .attr("dx", "-5em")
              .attr("transform", "rotate(-90)")
              .text(opts.settings.yLabel);

            svg.append("text")
                .attr("x", margin.left)
                .attr("y", margin.top - (margin.top)/4)
                .attr("text-anchor", "left")
                .style("font-family", `${opts.settings.fontFamily}`)
                .style("font-size", "14px")
                .text(opts.settings.subtitleLabel);

            svg.append("text")
                .style("font-family", `${opts.settings.fontFamily}`)
                .style("font-size", "14px")
                .attr("x", width - (margin.left) + 25)
                .attr("y", (height/4) - 6)
                .text(`${c1} >`);

            svg.append("text")
              .style("font-family", `${opts.settings.fontFamily}`)
              .style("font-size", "14px")
              .attr("x", width - (margin.left) + 25)
              .attr("y", (height/4) + 13)
              .text(`${c2} >`);

          svg.append("g")
              .call(yAxis);
        }

      },

      resize: function(width, height) {

        // TODO: code to re-render the widget with a new size

      }

    };
  }
});
