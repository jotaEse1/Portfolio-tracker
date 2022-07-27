import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useAppSelector } from '../../hooks/hooks';
import './TickerChart.css'
import { dates } from '../../utils/dates';
import { TickerAPI } from '../../types/types';

const TickerChart = () => {
    const [modality, setModality] = useState('linear')
    const { detailTicker, tickerGraph } = useAppSelector(state => state.ticker);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!modality.length) return

        d3LineChart(tickerGraph)
    }, [detailTicker.symbol, modality])

    const d3LineChart = (candles: TickerAPI[]) => {
        d3.selectAll('.ticker-chart-g')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()
        
        d3.selectAll('.tooltip')
            .transition()
            .duration(1000)
            .style('opacity', 0)
            .remove()

        const svg = d3.select(svgRef.current)
            .append('g')
            .attr('class', 'ticker-chart-g'),
            box = document.querySelector('.svg-ticker-container') as HTMLDivElement,
            width = box.offsetWidth,
            height = box.offsetHeight,
            padding = 10;

        const tooltip = d3.select(".svg-ticker-container")
            .append("div")
            .attr('class', 'tooltip')
            .style("position", "absolute")
            .style("visibility", "hidden")

        //to remove previuos axes and the bar chart

        //scales
        const minDate = d3.min(candles, d => d.datetime),
            maxDate = d3.max(candles, d => d.datetime),
            maxPrice = d3.max(candles, d => d.close),
            minPrice = d3.min(candles, d => d.close);

        const xScale = d3.scaleTime()
            .domain([minDate!, maxDate!])
            .range([padding, width - 10])

        const scale = modality === 'linear' ? d3.scaleLinear() : d3.scaleLog()
        const yScale = scale
            .domain([minPrice! - (minPrice! * 0.1), maxPrice! + (maxPrice! * 0.1)])
            .range([height - 25, 10])

        // //axis
        const xAxis = svg.append('g')
            .attr('transform', `translate(0, ${height - 25})`)
            .attr('class', 'axis-ticker')
            .style('fill', 'transparent')
            .call(d3.axisBottom(xScale))

        const yAxis = svg.append('g')
            .attr('transform', `translate(${padding}, 0)`)
            .attr('class', 'axis-ticker')
            .style('fill', 'transparent')
            .style('display', 'none')
            .call(d3.axisLeft(yScale))

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
            .attr("class", "circle-ticker")
            .attr("r", 4);

        // append the x line
        focus.append("line")
            .attr("class", "x-ticker")

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

        const bisectDate = d3.bisector((d: TickerAPI) => d.datetime).left;

        function mousemove(evt: PointerEvent) {
            const x0 = xScale.invert(d3.pointer(evt)[0]) as unknown as number,
                i = bisectDate(candles, x0, 1),
                d0 = candles[i - 1],
                d1 = candles[i];

            if (!d0 || !d1) return

            const d = x0 - d0.datetime > d1.datetime - x0 ? d1 : d0,
                { year, month, date } = dates(d.datetime);

            focus.select(".circle-ticker")
                .attr("transform", `translate(${xScale(d.datetime)}, ${yScale(d.close)})`);

            focus.select(".x-ticker")
                .attr('x1', xScale(d.datetime))
                .attr('y1', 25)
                .attr('x2', xScale(d.datetime))
                .attr('y2', height - 25)

            tooltip.style("top", `${evt.pageY - 40.38}px`)
                .style("left", `${evt.pageX >= width * 0.50 ? evt.pageX - 170 : evt.pageX + 10}px`)
                .html(`<p>$ ${(d.close).toFixed(2)}  ${year}-${month}-${date}</p>`)

        }

        svg.append('g')
            .append('path')
            .datum(candles)
            .attr('class', 'area-ticker')
            .attr('fill', 'url(#mygrad)')
            .style('opacity', 0)
            .attr('d', d3.area<any>()
                .x(d => xScale(d.datetime))
                .y0(height - 25)
                .y1(height - 25)
                .curve(d3.curveCatmullRom.alpha(0.5))
            )
            .transition().ease(d3.easeExp).duration(3100)
            .style('opacity', 1)
            .attr('d', d3.area<any>()
                .x(d => xScale(d.datetime))
                .y0(height - 25)
                .y1(d => yScale(d.close))
                .curve(d3.curveCatmullRom.alpha(0.5))
            )
    }

    return (
        <div className='ticker-chart-container'>
            <div className='ticker-chart'>
                <div className='svg-ticker-container'>
                    <svg
                        ref={svgRef}
                        height={'100%'}
                        width={'100%'}
                    ></svg>
                </div>
                <div className='ticker-labels-container'>
                    <div>
                        <div
                            className={modality === 'log' ? 'modality-selected' : 'modality-option'}
                            onClick={() => setModality('log')}
                        >
                            <p>Logarithmic Scale</p>
                        </div>
                        <div
                            className={modality === 'linear' ? 'modality-selected' : 'modality-option'}
                            onClick={() => setModality('linear')}
                        >
                            <p>Linear Scale</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TickerChart;