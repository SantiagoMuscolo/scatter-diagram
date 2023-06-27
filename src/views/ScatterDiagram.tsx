import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { getData } from '../service/apiService';
import '../App.css';

export const Scatter: React.FC = () => {
    const [data, setData] = useState<Array<any>>([]);

    useEffect(() => {
        const fetchData = async () => {
            const newData = await getData();
            setData(newData);
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            createChart();
        }
    }, [data]);

    const createChart = () => {
        const margin = { top: 30, right: 30, bottom: 70, left: 70 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3
            .select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3
            .scaleLinear()
            .domain([d3.min(data, (d: [number, string, string[], Date]) => d[0])!, d3.max(data, (d: [number, string, string[], Date]) => d[0])!])
            .range([0, width]);

        const yScale = d3
            .scaleTime()
            .domain(d3.extent(data, (d: [number, string, string[], Date]) => d[3]) as [Date, Date])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2f'));

        svg
            .append('g')
            .attr('id', 'x-axis')
            .attr('transform', `translate(0, ${height})`)
            .call(xAxis);

        svg.append('g').attr('id', 'y-axis').call(yAxis);

        svg
            .selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('data-xvalue', (d: any) => d[0])
            .attr('data-yvalue', (d: any) => d[3])
            .attr('cx', (d: [number, string, string[], Date]) => xScale(d[0]))
            .attr('cy', (d: [number, string, string[], Date]) => yScale(d[3]))
            .attr('r', 6)
            .attr('fill', (d: [number, string, string[], Date]) => (d[2].includes('Doping') ? 'red' : 'green'))
            .on('mouseover', (event: { pageX: number; pageY: number; }, d: [number, string, string[], Date]) => {
                const tooltip = d3.select('#tooltip');
                tooltip
                    .style('opacity', 0.9)
                    .style('left', event.pageX + 'px')
                    .style('top', event.pageY + 'px')
                    .attr('data-year', d[0])
                    .html(`${d[1]} (${d[2]})`);
            })
            .on('mouseout', () => {
                d3.select('#tooltip').style('opacity', 0);
            });

        
    };

    return (
        <div className="App">
            <h1 id="title">Best times in racing</h1>
            <div id="chart"></div>
            <div id="tooltip"></div>
        </div>
    );
};
