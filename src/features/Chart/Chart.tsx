import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';
import { GraphReturns, Portfolio } from '../../types/types';
import './Chart.css'
import { dates } from '../../utils/dates';
import { setCurrentGraph, setCurrentTime } from './ChartSlice';

const Chart = () => {
    const svgRef = useRef<SVGSVGElement | null>(null),
        { time, currentTime, chartTipe, currentChartTipe } = useAppSelector(state => state.chart),
        { currentPortfolio } = useAppSelector(state => state.dashboard),
        dispatch = useAppDispatch();

    useEffect(() => {
        if (!Object.keys(currentPortfolio).length) return;

        if (currentChartTipe.key === 'tree') d3TreeChart(currentPortfolio)
        else d3LineChart(currentPortfolio.returns.graph)

    }, [currentPortfolio, currentTime, currentChartTipe])

    const d3LineChart = (info: { [key: string]: GraphReturns }) => {
        const entries = Object.entries(info),
            min = entries.length - currentTime.num <= 0 ? 0 : entries.length - currentTime.num,
            max = entries.length,
            data = Object.fromEntries(entries.slice(min, max)),
            keys = Object.keys(data);

        //console.log(entries)
        d3.selectAll('.tree-map-g')
            .transition()
            .duration(500)
            .style('opacity', 0)
            .remove()
        
        d3.selectAll('.line-chart-g')
            .transition()
            .duration(500)
            .style('opacity', 0)
            .remove()
        
        d3.selectAll('.tooltip')
            .remove()

        const svg = d3.select(svgRef.current)
            .append('g')
            .attr('class', 'line-chart-g'),
            box = document.querySelector('.svg-container') as HTMLDivElement,
            width = box.offsetWidth,
            height = box.offsetHeight,
            padding = 50;

        const tooltip = d3.select(".svg-container")
            .append("div")
            .attr('class', 'tooltip')
            .style("position", "absolute")
            .style("visibility", "hidden")

        //to remove previuos axes and the bar chart
        d3.selectAll('.axis')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        d3.selectAll('.line')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        d3.selectAll('.area')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        d3.selectAll('.grid')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

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
        const graphKey = currentChartTipe.key === 'tree'? 'percentage' : currentChartTipe.key,
            minDate = d3.min(keys, d => Number(d.slice(1))),
            maxDate = d3.max(keys, d => Number(d.slice(1))),
            maxPrice = d3.max(keys, d => data[d][graphKey]),
            minPrice = d3.min(keys, d => data[d][graphKey]),
            paddingDates = 30000000,
            paddingValues = currentChartTipe.key === 'total' ? maxPrice! * 0.10 : 0.05,
            yFormat = currentChartTipe.key === 'total' ? '~s' : ',.1%',
            xFormat = currentTime.period === '1W' || currentTime.period === '2W'
                ? '%m/%d'
                : currentTime.period === '1M' || currentTime.period === '3M'
                    ? "%d %b"
                    : "%m/%Y",
            period = currentTime.period === '1W' || currentTime.period === '2W'
                ? 5
                : currentTime.period === '1M' || currentTime.period === '3M'
                    ? 5
                    : 3,
            radius = currentTime.period === '1W' || currentTime.period === '2W'
                ? 6
                : currentTime.period === '1M' || currentTime.period === '3M'
                    ? 5
                    : 4;

        const xScale = d3.scaleTime()
            .domain([minDate! - paddingDates, maxDate! + paddingDates])
            .range([padding, width - 10])

        const yScale = d3.scaleLinear()
            .domain([minPrice! - paddingValues, maxPrice! + paddingValues])
            //.domain([minPrice! - 0.02, maxPrice! + maxPrice! * 0.10])
            .range([height - 25, 10])

        // //axis
        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${height - 25})`)
            .attr('class', 'axis')
            .style('fill', 'transparent')
            .call(d3.axisBottom<any>(xScale).ticks(period).tickFormat(d3.timeFormat(xFormat)))

        const yAxis = svg.append('g')
            .attr('transform', `translate(${padding}, 0)`)
            .attr('class', 'axis')
            .style('fill', 'transparent')
            .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(`${yFormat}`)))

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
        //    .data(keys)
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
            .datum(keys)
            .attr("fill", "none")
            //.attr("stroke", "#0f0")
            .attr("stroke-width", 3)
            .attr('class', 'line')
            .attr("d", d3.line<any>()
                .x((d: string) => xScale(Number(d.slice(1))))
                .y((d: string) => yScale(data[d][graphKey]))
                .curve(d3.curveCatmullRom.alpha(0.5))
            )
            .attr("filter", "url(#dropshadow)");

        const pathLength = path.node()!.getTotalLength();

        const transitionPath: any = d3.transition()
            .ease(d3.easeExp)
            .duration(3000);

        path.attr("stroke-dashoffset", pathLength)
            .attr("stroke-dasharray", pathLength)
            .transition(transitionPath)
            .attr("stroke-dashoffset", 0);

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
            .attr("r", radius);

        // append the x line
        focus.append("line")
            .attr("class", "x")
            .style("stroke-dasharray", "3,3")

        // append the y line
        focus.append("line")
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
            const { year, month, date } = dates(new Date(xScale.invert(d3.pointer(evt)[0])).getTime()),
                x0 = new Date(`${year}-${month}-${date} 02:00:00`).getTime(),
                d0 = x0 - 86400000,
                d1 = x0,
                d = x0 - d0 > d1 - x0 ? d1 : d0,
                xValue: number = `_${d}` in data ? d : 0,
                yValue: number = `_${d}` in data ? data[`_${d}`][graphKey] : 0;

            if (xValue || yValue) {
                focus.select(".circle")
                    .attr("transform", `translate(${xScale(xValue)}, ${yScale(yValue)})`);

                focus.select(".x")
                    .attr('x1', xScale(xValue))
                    .attr('y1', 25)
                    .attr('x2', xScale(xValue))
                    .attr('y2', height - 25)

                // .attr("transform", `translate(${xScale(xValue)}, ${yScale(yValue)})`)
                // .attr("y1", 0)
                // .attr("y2", height - 25 - yScale(yValue));

                focus.select(".y")
                    .attr("transform", `translate(${padding}, ${yScale(yValue)})`)
                    .attr("x1", 0)
                    .attr("x2", width + width);

                tooltip.style("top", `${evt.pageY - 30.38}px`)
                    .style("left", `${evt.pageX >= width * 0.50 ? evt.pageX - 170 : evt.pageX + 10}px`)
                    .html(currentChartTipe.key === 'total'
                        ? `<p>$ ${(data[`_${d}`][graphKey]).toFixed(2)}  ${data[`_${d}`].date}</p>`
                        : `<p>${(data[`_${d}`][graphKey] * 100).toFixed(2)}%  ${data[`_${d}`].date}</p>`
                    )

            }
        }

        svg.append('g')
            .append('path')
            .datum(keys)
            .attr('class', 'area')
            .attr('fill', 'url(#mygrad)')
            .style('opacity', 0)
            .attr('d', d3.area<any>()
                .x((d: string) => xScale(Number(d.slice(1))))
                .y0(height - 25)
                .y1(height - 25)
                .curve(d3.curveCatmullRom.alpha(0.5))
            )
            .transition().ease(d3.easeExp).duration(3100)
            .style('opacity', 1)
            .attr('d', d3.area<any>()
                .x((d: string) => xScale(Number(d.slice(1))))
                .y0(height - 25)
                .y1((d: string) => yScale(data[d][graphKey]))
                .curve(d3.curveCatmullRom.alpha(0.5))
            )




        // setTimeout(() => {
        //     svg.append('path')
        //         .datum(keys)
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

    const d3TreeChart = (info: Portfolio) => {
        const box = document.querySelector('.svg-container') as HTMLDivElement,
            width = box.offsetWidth,
            height = box.offsetHeight,
            padding = 25,
            colors = [
                'rgb(246, 53, 56)',
                'rgb(191, 64, 69)',
                'rgb(139, 68, 78)',
                'rgb(65, 69, 84)', //grey
                'rgb(53, 118, 78)',
                'rgb(47, 158, 79)',
                'rgb(48, 204, 90)'
            ];
        
        d3.selectAll('.tooltip-tree')
            .remove()

        const tooltip = d3.select(".svg-container")
            .append("div")
            .attr('class', 'tooltip-tree')
            .style("position", "absolute")
            .style("visibility", "hidden")

        d3.selectAll('.line-chart-g')
            .transition()
            .duration(200)
            .style('opacity', 0)
            .remove()

        const svg = d3.select<SVGElement, unknown>(svgRef.current!)
            .append('g')
            .attr('class', 'tree-map-g')
            .attr('transform', `translate(${padding / 2}, ${padding / 2})`)
            .call(d3.zoom<any, any>()
                .duration(1000)
                .scaleExtent([1, 8]) //limits the zoom
                .translateExtent([[0, 0], [width - padding, height - padding]]) //limits the panning
                .on("zoom", (evt: any) => {
                    svg.attr("transform", evt.transform)
                })
            );

        //nodes
        const root = d3.hierarchy(info, (d: any) => d.tickers)
            .sum((d: any) => {
                if (d.name === currentPortfolio.name) return 0

                const ppal = Number(d.currentPrice) * Number(d.purchaseStocks),
                    totalIn = !!d.sharesFlow.in.totalIn ? d.sharesFlow.in.totalIn * Number(d.currentPrice) : 0

                return (ppal + totalIn) / currentPortfolio.value
            })
            .sort((a: any, b: any) => b.value - a.value)

        const treemap = d3.treemap()
            .size([width - padding, height - padding])
            .paddingInner(1)

        const treeData = treemap(root)

        const leaves = treeData.leaves()

        //console.log(root)

        //elements 
        const tree = svg.selectAll('g')
            .data(leaves)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x0}, ${d.y0})`);

        tree.append('rect')
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => 0)
            .attr('class', (d: any) => `${d.data.name}-rect`)
            .attr('fill', 'white')
            .attr('opacity', 0)
            .transition().duration(1500).delay((d, i) => 30 * i)
            .attr('width', d => d.x1 - d.x0)
            .attr('height', d => d.y1 - d.y0)
            .style('stroke', 'transparent')
            .style('stroke-width', '1px')
            .attr('opacity', 1)
            .attr("fill", (d: any) : string => {
                if (d.data.returns._1Day['%'] * 100 <= -3) return colors[0]
                else if (d.data.returns._1Day['%'] * 100 <= -2) return colors[1]
                else if (d.data.returns._1Day['%'] * 100 <= -1) return colors[2]
                else if (d.data.returns._1Day['%'] * 100 <= 0) return colors[3]
                else if (d.data.returns._1Day['%'] * 100 <= 1) return colors[4]
                else if (d.data.returns._1Day['%'] * 100 <= 2) return colors[5]
                else return colors[6]
            })
            //.on("mousemove", (evt: PointerEvent) => mousemove(evt));

        tree.append('foreignObject')
            .attr('x', 0)
            .attr('y', 0)
            .attr('style', d => `width: ${d.x1 - d.x0}; height: ${d.y1 - d.y0}; padding: 2px;`)
            .attr('class', (d: any) => `${d.data.name}-obj`)
            .attr('id', 'foreign')
            .on("mouseover", (evt, d: any) => {
                const selector = d.data.name,
                    foreign = document.querySelector(`.${selector}-obj`),
                    div = foreign!.children;

                foreign!.id = 'foreign-hover'
                div[0].id = 'tree-text-hover'

                tooltip.style("visibility", "visible")

                tooltip.style("top", `${evt.pageY - 30.38}px`)
                    .style("left", `${evt.pageX >= width * 0.50 ? evt.pageX - 170 : evt.pageX + 10}px`)
                    .html(`<p>${d.data.name} ${(d.data.returns._1Day['%'] * 100).toFixed(2)} %</p>`)
            })
            .on("mouseout", (evt, d: any) => {
                const selector = d.data.name,
                    foreign = document.querySelector(`.${selector}-obj`),
                    div = foreign!.children;

                foreign!.id = 'foreign'
                div[0].id = 'tree-text'

                tooltip.style("visibility", "hidden")
            })
            .append('xhtml:div')
            .style('color', '#fff')
            .style("font-size", d => `${((d.x1 - d.x0) + ( (d.y1 - d.y0) * 0.7) ) * 0.09}px`)
            .style('opacity', 0)
            .transition().duration(1500).delay((d, i) => 30 * i)
            .style('color', '#fff')
            .style("font-size", d => `${((d.x1 - d.x0) + ( (d.y1 - d.y0) * 0.7) ) * 0.09}px`)
            .style('opacity', 1)
            .text((d: any) => `${d.data.name} ${(d.data.returns._1Day['%'] * 100).toFixed(2)}%`)

        //let categories = root.tickers.map(d => d.name)
    }

    return (
        <div className='chart-container'>
            <h2>Portfolio Chart</h2>
            <div className='chart' >
                <div className='chart-graphs-options'>
                    <div className='graphs-options-container'>
                        {chartTipe.map(method =>
                            <div
                                key={method.key}
                                className={method.key === currentChartTipe.key ? 'graphs-options-selected' : 'graphs-options'}
                                onClick={() => dispatch(setCurrentGraph(method))}
                            >
                                {method.title}
                            </div>
                        )}
                    </div>
                </div>
                <div className='chart-pannel'>
                    {time.map(option =>
                        <div
                            key={option.num}
                            className={option.period === currentTime.period ? 'time-selected' : 'time-option'}
                            onClick={() => {
                                if(currentChartTipe.title === 'Tree Map') return
                                
                                dispatch(setCurrentTime(option))
                            }}
                        >
                            <p>{option.period}</p>
                        </div>
                    )}
                </div>
                <div className='svg-container'>
                    <svg
                        ref={svgRef}
                        height={'100%'}
                        width={'100%'}
                    ></svg>
                </div>
            </div>
        </div>
    );
};

export default Chart;