import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useAppSelector } from '../../hooks/hooks';
import './TickerChart.css'
import { dates } from '../../utils/dates';
import { TickerAPI, TickerGraph } from '../../types/types';

const TickerChart = () => {
    const { detailTicker, tickerGraph } = useAppSelector(state => state.ticker);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {

        d3LineChart(tickerGraph.candles)
    }, [detailTicker.symbol])

    const d3LineChart = (candles: TickerAPI[]) => {
        d3.selectAll('.ticker-chart-g')
            // .transition()
            // .duration(1000)
            // .style('opacity', 0)
            .remove()

        const svg = d3.select(svgRef.current)
            .append('g')
            .attr('class', 'ticker-chart-g'),
            box = document.querySelector('.svg-ticker-container') as HTMLDivElement,
            width = box.offsetWidth,
            height = box.offsetHeight,
            padding = 50;

        const tooltip = d3.select(".svg-ticker-container")
            .append("div")
            .attr('class', 'tooltip')
            .style("position", "absolute")
            .style("visibility", "hidden")

        //to remove previuos axes and the bar chart
        d3.selectAll('.axis-ticker')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        d3.selectAll('.line-ticker')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        d3.selectAll('.area-ticker')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        // d3.selectAll('.grid')
        //     .transition()
        //     .duration(1000)
        //     .style('opacity', 0)
        //     .remove()

        // d3.selectAll('.bar')
        //     .transition()
        //     .duration(1000)
        //     .attr('x', width / 2)
        //     .attr('y', height - 25)
        //     .attr('height', 0)
        //     .style('fill','#fff')
        //     .style('opacity', 0)
        //     .remove()

        //scales
        const minDate = d3.min(candles, d => d.datetime),
            maxDate = d3.max(candles, d => d.datetime),
            maxPrice = d3.max(candles, d => d.close),
            minPrice = d3.min(candles, d => d.close),
            paddingDates = 30000000;
        // paddingValues = currentChartTipe.key === 'total' ? maxPrice! * 0.10 : 0.05,
        // yFormat = currentChartTipe.key === 'total' ? '~s' : ',.1%',
        // xFormat = currentTime.period === '1W' || currentTime.period === '2W'
        //     ? '%m/%d'
        //     : currentTime.period === '1M' || currentTime.period === '3M'
        //         ? "%d %b"
        //         : "%m/%Y",
        // period = currentTime.period === '1W' || currentTime.period === '2W'
        //     ? 5
        //     : currentTime.period === '1M' || currentTime.period === '3M'
        //         ? 5
        //         : 3,
        // radius = currentTime.period === '1W' || currentTime.period === '2W'
        //     ? 6
        //     : currentTime.period === '1M' || currentTime.period === '3M'
        //         ? 5
        //         : 4;

        const xScale = d3.scaleTime()
            .domain([minDate!, maxDate!])
            //.domain([minDate! - paddingDates, maxDate! + paddingDates])
            .range([padding, width - 10])

        const yScale = d3.scaleLinear()
            .domain([minPrice!, maxPrice!])
            //.domain([minPrice! - paddingValues, maxPrice! + paddingValues])
            //.domain([minPrice! - 0.02, maxPrice! + maxPrice! * 0.10])
            .range([height - 25, 10])

        // //axis
        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${height - 25})`)
            .attr('class', 'axis-ticker')
            .style('fill', 'transparent')
            .call(d3.axisBottom(xScale))
        //.call(d3.axisBottom(xScale).ticks(period).tickFormat(d3.timeFormat(xFormat)))

        const yAxis = svg.append('g')
            .attr('transform', `translate(${padding}, 0)`)
            .attr('class', 'axis-ticker')
            .style('fill', 'transparent')
            .call(d3.axisLeft(yScale))
        //.call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(`${yFormat}`)))

        // //clip. For not drawing out of this area
        // const clip = svg.append('defs').append('SVG:clipPath')
        //     .attr('id', 'clip')
        //     .append('SVG:rect')
        //     .attr('width', width)
        //     .attr('height', height)
        //     .attr('x', padding)
        //     .attr('y', 20);

        //g element to add elements
        // const g = svg.append('g')
        //              .attr('clip-path', 'url(#clip)')
        //              .attr('class','zoom-g')

        // //barchart
        // g.selectAll('rect')
        //    .data(candles)
        //    .join(
        //        (enter: any) => enter.append('rect')
        //                      //.style('fill', '#fff')
        //                      //.style('stroke', 'transparent')
        //                      .attr('x', (d: string) => xScale(d.slice(1)))
        //                      .attr('rx', 0)
        //                      .attr('ry', 0)
        //                      .attr('y', height - 25)
        //                      .attr('height', 0)
        //                      .attr('class', 'bar')
        //                      .attr('id', (d: string) => `${data[d].date}`)
        //                      .transition().duration(1500).delay(1000)
        //                      .attr('x', (d: string) => xScale(d.slice(1)))
        //                      .attr('y', (d: string) => yScale(data[d][currentChartTipe.key] ))
        //                      .attr('rx', 2)
        //                      .attr('ry', 2)
        //                      .attr('width', rectWidth)
        //                      .attr('height', (d: string) => height - 25 - yScale(data[d][currentChartTipe.key] ))
        //                      //.style('fill', '#1a1a7e')
        //                      //.style('stroke', '#fff8')    
        //    )


        //line shadow        
        const defs = svg.append("defs");

        const filter = defs.append("filter")
            .attr("id", "dropshadow")

        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 4)
            .attr("result", "blur");

        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 4)
            .attr("dy", 4)
            .attr("result", "offsetBlur");

        const feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        //line chart
        const path = svg.append("g")
            .append("path")
            .datum(candles)
            .attr("fill", "none")
            //.attr("stroke", "#0f0")
            .attr("stroke-width", 3)
            .attr('class', 'line-ticker')
            .attr("d", d3.line<any>()
                .x(d => xScale(d.datetime))
                .y(d => yScale(d.close))
                .curve(d3.curveCatmullRom.alpha(0.5))
            )
            .attr("filter", "url(#dropshadow)");

        // const pathLength = path.node()!.getTotalLength();

        // const transitionPath: any = d3.transition()
        //     .ease(d3.easeExp)
        //     .duration(3000);

        // path.attr("stroke-dashoffset", pathLength)
        //     .attr("stroke-dasharray", pathLength)
        //     .transition(transitionPath)
        //     .attr("stroke-dashoffset", 0);

        //gradient for area chart
        var lg = svg.append("defs").append("linearGradient")
            .attr("id", "mygrad")
            .attr("x1", "0%")
            .attr("x2", "0%")
            .attr("y1", "0%")
            .attr("y2", "100%")//vertical --> y1 =/= y2 and x1 === x2;

        lg.append("stop")
            .attr("offset", "0%")
            .attr('class', 'stop-1')
            .style("stop-opacity", 1)

        lg.append("stop")
            .attr("offset", "100%")
            .attr('class', 'stop-2')
            .style("stop-opacity", 1)

        const focus = svg.append("g")
            .style("display", "none");

        focus.append("circle")
            .attr("class", "circle")
            .attr("r", 4);
        //.attr("r", radius);

        // append the x line
        focus.append("line-ticker")
            .attr("class", "x")
            .style("stroke-dasharray", "3,3")

        // append the y line
        focus.append("line-ticker")
            .attr("class", "y")
            .style("stroke-dasharray", "3,3")
            .attr("x1", width)
            .attr("x2", width);

        // append the rectangle to capture mouse               
        svg.append("rect")
            .attr('x', padding)
            .attr("width", width - padding + 10)
            .attr("height", height - 25)
            .style("fill", "none")
            .style("pointer-events", "all")
            .on("mouseover", () => { focus.style("display", null); tooltip.style("visibility", "visible") })
            .on("mouseout", () => { focus.style("display", "none"); tooltip.style("visibility", "hidden") })
            .on("mousemove", (evt: PointerEvent) => mousemove(evt));

        function mousemove(evt: PointerEvent) {
            console.log(xScale.invert(d3.pointer(evt)[0]), yScale.invert(d3.pointer(evt)[0]))
            // const { year, month, date } = dates(new Date(xScale.invert(d3.pointer(evt)[0])).getTime()),
            //     x0 = new Date(`${year}-${month}-${date} 02:00:00`).getTime(),
            //     d0 = x0 - 86400000,
            //     d1 = x0,
            //     d = x0 - d0 > d1 - x0 ? d1 : d0,
            //     xValue: number = `_${d}` in data ? d : 0,
            //     yValue: number = `_${d}` in data ? data[`_${d}`][currentChartTipe.key] : 0;

            // if (xValue || yValue) {
            //     focus.select(".circle")
            //         .attr("transform", `translate(${xScale(xValue)}, ${yScale(yValue)})`);

            //     focus.select(".x")
            //         .attr('x1', xScale(xValue))
            //         .attr('y1', 25)
            //         .attr('x2', xScale(xValue))
            //         .attr('y2', height - 25)

            //     // .attr("transform", `translate(${xScale(xValue)}, ${yScale(yValue)})`)
            //     // .attr("y1", 0)
            //     // .attr("y2", height - 25 - yScale(yValue));

            //     focus.select(".y")
            //         .attr("transform", `translate(${padding}, ${yScale(yValue)})`)
            //         .attr("x1", 0)
            //         .attr("x2", width + width);

            //     tooltip.style("top", `${evt.pageY - 30.38}px`)
            //         .style("left", `${evt.pageX >= width * 0.50 ? evt.pageX - 170 : evt.pageX + 10}px`)
            //         .html(currentChartTipe.key === 'total'
            //             ? `<p>$ ${(data[`_${d}`][currentChartTipe.key]).toFixed(2)}  ${data[`_${d}`].date}</p>`
            //             : `<p>${(data[`_${d}`][currentChartTipe.key] * 100).toFixed(2)}%  ${data[`_${d}`].date}</p>`
            //         )

            // }
        }

        svg.append('g')
            .append('path')
            .datum(candles)
            .attr('class', 'area-ticker')
            .attr('fill', 'url(#mygrad)')
            // .style('opacity', 0)
            // .attr('d', d3.area<any>()
            //     .x(d => xScale(d.datetime))
            //     .y0(height - 25)
            //     .y1(height - 25)
            //     .curve(d3.curveCatmullRom.alpha(0.5))
            // )
            // .transition().ease(d3.easeExp).duration(3100)
            .style('opacity', 1)
            .attr('d', d3.area<any>()
                .x(d => xScale(d.datetime))
                .y0(height - 25)
                .y1(d => yScale(d.close))
                .curve(d3.curveCatmullRom.alpha(0.5))
            )




        // setTimeout(() => {
        //     svg.append('path')
        //         .datum(candles)
        //         .attr('class','line')
        //         .attr('id', 'area')
        //         .attr('d', 100)
        //         .transition().ease(d3.easeExp).duration(3000)
        //         .attr('d', d3.area<any>()
        //              .x((d: string) => xScale(d.slice(1)))
        //              .y0(height - 25)
        //              .y1((d: string) => yScale(data[d][currentChartTipe.key] ))
        //         )
        // }, 3000);



        // //zoom
        // const zoom = d3.zoom()
        //     .duration(1000)
        //     .scaleExtent([1, 5]) //limits the zoom
        //     .translateExtent([[0, 0], [width, height]]) //limits the panning
        //     .on('zoom', updateChart)

        // //area to make zoom
        // svg.append('rect')
        //     .attr('width', width - padding)
        //     .attr('height', height - 25)
        //     .style('fill', 'none')
        //     .style('pointer-events', 'all')
        //     .attr('transform', 'translate(padding,0)')
        //     .call(zoom);

        // function updateChart(event) {
        //     //scales
        //     const newX = event.transform.rescaleX(xScale)
        //     const newY = event.transform.rescaleY(yScale)

        //     xAxis.call(d3.axisBottom(newX))
        //     yAxis.call(d3.axisLeft(newY))

        //     //chart
        //     svg.select('.line')
        //         .attr("fill", "none")
        //         .attr("stroke", "#0f0")
        //         .attr("stroke-width", 3)
        //         .attr('class', 'line')
        //         .attr("d", d3.line<any>()
        //             .x((d: string) => newX(Number(d.slice(1))))
        //             .y((d: string) => newY(data[d][currentChartTipe.key] ))
        //         )

        //     svg.select('.area')
        //         .attr('d', d3.area<any>()
        //             .x((d: string) => newX(Number(d.slice(1))))
        //             .y0(height - 25)
        //             .y1((d: string) => newY(data[d][currentChartTipe.key] ))
        //         )
        // }

    }

    const d3candleStickChart = (tickerObj: TickerGraph) => {
        const {chunkCandles, minPrice, maxPrice, minDate, maxDate} = tickerObj

        d3.selectAll('.ticker-chart-g')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        const box = document.querySelector('.svg-ticker-container') as HTMLDivElement,
            width = box.offsetWidth,
            height = box.offsetHeight,
            padding = 50

        const svg = d3.select(svgRef.current)
            .append('g')
            .attr('class', 'ticker-chart-g')

        //delete previous axis, candles, lines
        d3.selectAll('.axis-ticker')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        d3.selectAll('.candles-ticker')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        d3.selectAll('.stick-ticker')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        const paddingDates = 86400000,
            totalCandles = chunkCandles.length * 20,
            band_width = (width / totalCandles) * 0.7;

        //scales
        const xScale = d3.scaleTime()
            .domain([minDate - paddingDates, maxDate])
            .range([padding, width - 10])

        const yScale = d3.scaleLinear()
            .domain([minPrice - (minPrice * 0.1), maxPrice + (maxPrice * 0.1)])
            .range([height - 25, 10])

        //axis
        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${height - 25})`)
            .attr('class', 'axis-ticker')
            .style('fill', 'transparent')
            .call(d3.axisBottom(xScale))

        const yAxis = svg.append('g')
            .attr('transform', `translate(${padding}, 0)`)
            .attr('class', 'axis-ticker')
            .style('fill', 'transparent')
            .call(d3.axisLeft(yScale))

        //candles
        for (let i = 0; i < chunkCandles.length; i++) {
            const hundredCandles = chunkCandles[i];

            setTimeout(() => {
                svg.selectAll("candles")
                    .data(hundredCandles)
                    .join("rect")
                    .attr("x", (d) => xScale(d.datetime) - band_width * 0.5)
                    .attr("y", (d) => yScale(d3.max([d.open, d.close])!))
                    .attr("width", band_width)
                    .attr("height", (d) => Math.abs(yScale(d.open) - yScale(d.close)))
                    .attr("fill", (d) => (d.open < d.close ? "green" : "red"))
                    .attr("class", "candles-ticker");
        
                svg.selectAll("stick")
                    .data(hundredCandles)
                    .join("rect")
                    .attr("x", (d) => xScale(d.datetime))
                    .attr("y", (d) => yScale(d.high))
                    .attr("width", "1")
                    .attr("height", (d) => Math.abs(yScale(d.high) - yScale(d.low)))
                    .attr("fill", (d) => (d.open < d.close ? "green" : "red"))
                    .attr("class", "stick-ticker");
                    
            }, 1000);
        }
    }

    return (
        <div className='ticker-chart-container'>
            <div className='svg-ticker-container'>
                <svg
                    ref={svgRef}
                    height={'100%'}
                    width={'100%'}
                ></svg>
            </div>
        </div>
    );
};

export default TickerChart;