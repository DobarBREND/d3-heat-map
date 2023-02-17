let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
let req = new XMLHttpRequest(); //import data into js object

let baseTemp
let values = [];

let xScale
let yScale

let minYear
let maxYear

let width = 1200;
let height = 600;
let padding = 70;

let canvas = d3.select("#canvas")
            canvas.attr("width", width)
            canvas.attr("height", height)
            canvas.attr("fill", "LightGray");

            canvas.append("rect")
                    .attr("width", "470px")
                    .attr("height", "20px")
                    .attr("fill", "orange")
                    .attr("x", "350px")
                    .attr("y", "0px")
                    .attr("rx", 4);

            canvas.append("text")
                    .text("1753 - 2015: base temperature 8.66℃")
                    .attr("x", 440)
                    .attr("y", 15)
                    .attr("font-family", "sans-serif")
                    .attr("font-size", "16px")
                    .attr("fill", "black");

let tooltip = d3.select("#tooltip");

let createScales = () => { 

    minYear = d3.min(values, (item) => {
        return item["year"]
    })

    maxYear = d3.max(values, (item) => {
        return item["year"]
    })

    xScale = d3.scaleLinear()
            .domain([minYear, maxYear + 1]) //to show the data for the last year in domain properly
            .range([padding, width - padding])
            

    yScale = d3.scaleTime()
            .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
            .range([padding, height - padding])
};


let createCells = () => {
    
    canvas.selectAll("rect")
            .data(values)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("fill", (item) => {
                let variance = item["variance"]
                if(baseTemp + variance >= 2.9 && baseTemp + variance <= 3.9) {
                    return "Blue"
                } else if (baseTemp + variance > 3.9 && baseTemp + variance <= 5.0) {
                    return "SteelBlue"
                } else if (baseTemp + variance > 5.0 && baseTemp + variance <= 6.1) {
                    return "DeepSkyBlue"
                } else if (baseTemp + variance > 6.1 && baseTemp + variance <= 7.2) {
                    return "SkyBlue"
                } else if (baseTemp + variance > 7.2 && baseTemp + variance <= 8.3) {
                    return "Orange"
                } else if (baseTemp + variance > 8.3 && baseTemp + variance <= 9.5) {
                    return "DarkOrange"
                } else if (baseTemp + variance > 9.5 && baseTemp + variance <= 10.6) {
                    return "OrangeRed"
                } else if (baseTemp + variance > 10.6 && baseTemp + variance <= 11.7) {
                    return "Red"
                } else if (baseTemp + variance > 11.7 && baseTemp + variance <= 12.8) {
                    return "FireBrick"
                } else {
                    return "Crimson"
                }
            })
            .attr("data-year", (item) => {
                return item["year"]
            })
            .attr("data-month", (item) => {
                return item["month"] - 1 
            })
            .attr("data-temp", (item) => {
                return baseTemp + item["variance"]
            })
            .attr("height", (height - (2 * padding)) / 12)
            .attr("y", (item) => {
                return yScale(new Date(0, item["month"] - 1, 0, 0, 0, 0, 0))
            })
            .attr("width", (item) => {
                let numberOfYears = maxYear - minYear
               return (width - (2 * padding)) / numberOfYears
            })
            .attr("x", (item) => {
                return xScale(item["year"])
            })
            .on("mouseover", (event, item) => {
                                               
                tooltip.transition()
                        .style("visibility", "visible")

                let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                let formatDecimal = d3.format(",.2f");
                tooltip.text(item["year"] + " " + monthNames[item["month"] - 1] + " - " + "average temperature " + formatDecimal(baseTemp + item["variance"]) + " - variance (" + item["variance"] + ")")
                              

                tooltip.attr("data-year", item["year"])
            })
            .on("mouseout", (event, item) => {
                tooltip.transition()
                        .style("visibility", "hidden")
            })
};

    canvas.append("image")
            .attr("xlink:href", "https://raw.githubusercontent.com/d3/d3-logo/master/d3.png")
            .attr("width", 40)
            .attr("height", 40)
            .attr("x", 1145)
            .attr("y", 15);                

let createAxes = () => {
    let xAxis = d3.axisBottom(xScale)
                .tickFormat(d3.format("d")) // d - https://observablehq.com/@d3/d3-format

    let yAxis = d3.axisLeft(yScale)
                .tickFormat(d3.timeFormat("%B")) //%B - show months as a string

    canvas.append("g")
            .call(xAxis)
            .attr("id", "x-axis")
            .attr("transform", "translate(0, " + (height - padding) + ")")
         

    canvas.append("g")
            .call(yAxis)
            .attr("id", "y-axis")
            .attr("transform", "translate(" + padding + ", 0)")
           
};

req.open("GET", url, true);
req.onload = () => { //response to the request
    //console.log(req.responseText) ---- check the data is showing in the console
    let object = JSON.parse(req.responseText) //convert json data into js object
    baseTemp = object["baseTemperature"] // select a particular data from object
    values = object["monthlyVariance"]
    console.log(baseTemp)
    console.log(values)
    createScales()
    createCells()
    createAxes()

};
req.send(); //sending off the request