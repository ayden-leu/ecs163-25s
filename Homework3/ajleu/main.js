import * as convert from "./convert.js";
import * as style from "./style.js";

const dataset = "./data/mxmh_survey_results.csv";
const datasetBpmMax = 300;
const datasetHoursMax = 24;
const debugStyle = "" //"outline: 1px solid black"

// requirements
// implement two of the folllowing interaction techniques into your dashboard
//      ✅ selection:  select one or multiple datapoints
//      ✅ brushing:  selection of a subset of the displayed data in the visualization by either dragging the mouse over the data of interest or using a bounding shape to isolate this subset
//      pan and zoom:  rescale plot to focus on a part of the visualization
// incorporate one or more of the following transitions
//      view:  change in viewpoint, offten modeled as the movement of a camera through virutal space (e.g  zoom and pan)
//      substrate:  changes to spatial substrate in which marks are embedded (e.g  axis rescaling and log transforms as well as bifocal and graphical fisheye distortions)
//      ✅ filtering:  changing which elements are visible
//      ordering:  change order in which data is displayed
//      timestep:  apply temporal changes to data values
//      visualization change:  change visual mappings of the data (e.g  data in bar chart -> pie chart, user edits color palettes)
//      data schema change:  change the data dimensions being visualized (e.g  making mulltiple bars appear instead of one)

// bar graph:
//      change to scatterplot (x: age, y: hours per day)
//      interaction:  brushing
//      transition:  
// donut:
//      menu for choosing data type (data schema change transition)
//      interaction:  selection (choosing data type)
//      transition:  

function processRawData(rawData){
    rawData.forEach(function(entry){
        entry.age = Number(entry.age);
        entry.hours_per_day = Number(entry.hours_per_day);
        entry.while_working = (entry.while_working === "Yes");
        entry.instrumentalist = (entry.instrumentalist === "Yes");
        entry.composer = (entry.composer === "Yes");
        entry.exploratory = (entry.exploratory === "Yes");
        entry.foreign_languages = (entry.foreign_languages === "Yes");
        entry.bpm = Number(entry.bpm);
        entry.anxiety = Number(entry.anxiety);
        entry.depression = Number(entry.depression);
        entry.insomnia = Number(entry.insomnia);
        entry.ocd = Number(entry.ocd);
    });

    const filteredData = rawData.filter(entry => 
        entry.bpm <= datasetBpmMax && 
        entry.primary_streaming_service !== "" &&
        entry.hours_per_day < datasetHoursMax &&
        entry.age !== 0
    );

    return filteredData.map(entry => {
        return {
            "age": entry.age,
            "primary_streaming_service": entry.primary_streaming_service,
            "hours_per_day": entry.hours_per_day,
            "while_working": entry.while_working,
            "instrumentalist": entry.instrumentalist,
            "composer": entry.composer,
            "fav_genre": entry.fav_genre,
            "exploratory": entry.exploratory,
            "foreign_languages": entry.foreign_languages,
            "bpm": entry.bpm,
            "frequency_classical": entry.frequency_classical,
            "frequency_country": entry.frequency_country,
            "frequency_edm": entry.frequency_edm,
            "frequency_folk": entry.frequency_folk,
            "frequency_gospel": entry.frequency_gospel,
            "frequency_hip_hop": entry.frequency_hip_hop,
            "frequency_jazz": entry.frequency_jazz,
            "frequency_kpop": entry.frequency_kpop,
            "frequency_latin": entry.frequency_latin,
            "frequency_lofi": entry.frequency_lofi,
            "frequency_metal": entry.frequency_metal,
            "frequency_pop": entry.frequency_pop,
            "frequency_r_and_b": entry.frequency_r_and_b,
            "frequency_rap": entry.frequency_rap,
            "frequency_rock": entry.frequency_rock,
            "frequency_vgm": entry.frequency_vgm,
            "anxiety": entry.anxiety,
            "depression": entry.depression,
            "insomnia": entry.insomnia,
            "ocd": entry.ocd,
            "music_effects": entry.music_effects
        };
    });
}

function extractUniqueEntriesFromCategory(data, category){
    let newSet = new Set();
    data.forEach(function(entry){
        newSet.add(entry[category]);
    });

    newSet = Array.from(newSet);
    return newSet;
}

// main stuff
const svg = d3.select("svg");
const tooltip = d3.select("body").append("div")
    .style("display", "none")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "2px solid black")
    .style("border-radius", "10px")
    .style("padding", "10px")
    .style("padding-bottom", "0")
    .style("pointer-events", "none")
    .style("font-family", "sans-serif")
    .html("you shouldn't see this")
;

// get and process dataset
d3.csv(dataset).then(rawData =>{
    console.log("rawData", rawData);

    // process raw data
    const processedData = processRawData(rawData);
    console.log("processedData", processedData);

    // then create graphs
    createBarGraph(processedData);
    // createScatterPlot(processedData);
    createParallelPlot(processedData);
    createDonutChart(processedData);

    }).catch(function(error){
    console.log(error);
});

///////////////////////////////////////////////////////////////////////////
// stacked bar chart
//      x:  service
//      y:  age
///////////////////////////////////////////////////////////////////////////
function createBarGraph(dataset){
    // get total hours listened to music for each age
    let totalHoursEntriesPerAge = {};
    dataset.forEach(function(entry){
        const age = entry.age;
        const service = entry.primary_streaming_service;
        const hours = entry.hours_per_day;
        
        // get totals for each service for each age
        if(!totalHoursEntriesPerAge[age]){  // initialize entry
            totalHoursEntriesPerAge[age] = {"totalHours": 0, "count": 0, "services": {}};
        }
        if(!totalHoursEntriesPerAge[age].services[service]){  // initialize entry
            totalHoursEntriesPerAge[age].services[service] = 0;
        }
        totalHoursEntriesPerAge[age].services[service]++;
        totalHoursEntriesPerAge[age].totalHours += hours;
        totalHoursEntriesPerAge[age].count++;
    });
    console.log("totalHoursEntriesPerAge", totalHoursEntriesPerAge);

    // get unique services
    const services = extractUniqueEntriesFromCategory(dataset, "primary_streaming_service");
    console.log("services", services);

    // calculate averages
    let averageHoursPerAge = [];
    Object.keys(totalHoursEntriesPerAge).forEach(ageEntry => {
        const newEntry = {"age": ageEntry, "avgHours": 0, "services": {}};
        
        const total = totalHoursEntriesPerAge[ageEntry].totalHours;
        const count = totalHoursEntriesPerAge[ageEntry].count;
        newEntry.avgHours = total / count;
        
        services.forEach(serviceEntry => {  // gets service count for this entry
            const serviceCount = totalHoursEntriesPerAge[ageEntry].services[serviceEntry] || 0;
            newEntry.services[serviceEntry] = serviceCount;
        });
        averageHoursPerAge.push(newEntry);
    });
    console.log("averageHoursPerAge", averageHoursPerAge);

    // calculate how much each service contributes to the average
    averageHoursPerAge.forEach(entry => {
        let total = 0;
        Object.keys(entry.services).forEach(service => {
            total += entry.services[service];
        });
        
        Object.keys(entry.services).forEach(service => {
            // scale percentage by average hours for this age group
            entry.services[service] = entry.services[service] / total * entry.avgHours;
        }); 
    });
    console.log("averageHoursPerAge", averageHoursPerAge)

    // flatten data so stack can use it
    const flattenedData = averageHoursPerAge.map(entry => {
        const newEntry = {"age": entry.age, "totalAvg": entry.avgHours};

        services.forEach(service => {
            newEntry[service] = entry.services[service] || 0;  // || 0 is in case there is no value for this service
        });

        return newEntry;
    });
    console.log("flattenedData", flattenedData);

    // create area for bar graph
    const barGraph = svg.append("g")
        .attr("width", style.barGraph.width)
        .attr("height", style.barGraph.height)
        .attr("transform", `translate(${style.barGraph.offset.x}, ${style.barGraph.offset.y})`)
        .attr("style", debugStyle) 
        .classed("barGraph", true)
    ;

    // bar stack
    const stackedBars = d3.stack().keys(services);   // stacks the data
    const stackedData = stackedBars(flattenedData);  // based on services
    console.log("stackedData", stackedData);

    // x range
    const barGraphX = d3.scaleBand()
        .domain(averageHoursPerAge.map(entry => entry.age))
        .range([0, style.barGraph.width])
        .padding(0.2);

    // x axis visual
    const barGraphTicksX = d3.axisBottom(barGraphX);
    barGraph.append("g")
        .attr("transform", `translate(${style.barGraph.content.offset.x}, ${style.barGraph.height + style.barGraph.content.offset.y})`)
        .call(barGraphTicksX)
        .attr("font-size", `${style.barGraph.ticks.size}px`);

    // y range
    const stackedDataMaxY = d3.max(
        stackedData, layer => d3.max(
            layer, entry => entry[1]
        )
    );
    const barGraphY = d3.scaleLinear()
        .domain([0, stackedDataMaxY + 1])
        .range([style.barGraph.height, 0])
        .nice();

    // y axis visual
    const barGraphTicksY = d3.axisLeft(barGraphY).ticks(stackedDataMaxY/2);
    barGraph.append("g")
        .attr("transform", `translate(${style.barGraph.content.offset.x}, ${style.barGraph.content.offset.y})`)
        .call(barGraphTicksY)
    ;

    // x label
    barGraph.append("text")
        .attr("x", style.barGraph.labels.x.offset.x + style.barGraph.content.offset.x)
        .attr("y", style.barGraph.labels.x.offset.y + style.barGraph.content.offset.y)
        .attr("font-size", `${style.barGraph.labels.size}px`)
        .attr("text-anchor", "middle")
        .text(style.barGraph.labels.x.text);

    // y label
    barGraph.append("text")
        .attr("x", style.barGraph.labels.y.offset.y - style.barGraph.content.offset.y)
        .attr("y", style.barGraph.labels.y.offset.x + style.barGraph.content.offset.x)
        .attr("font-size", `${style.barGraph.labels.size}px`)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(style.barGraph.labels.y.text);

    // bars
    barGraph.selectAll("barGraph")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("transform", `translate(${style.barGraph.content.offset.x}, ${style.barGraph.content.offset.y})`)
        .attr("class", "layer")
        .attr("fill", entry => convert.getServiceColor(entry.key))
        .selectAll("rect")
        .data(entry => entry)
        .enter()
        .append("rect")
        .attr("x", entry => barGraphX(entry.data.age))                       // bars are drawn from top to bottom
        .attr("y", entry => barGraphY(entry[1]))                             // so the base is actually the top
        .attr("height", entry => barGraphY(entry[0]) - barGraphY(entry[1]))  // of the bar
        .attr("width", barGraphX.bandwidth())
        .on("mouseover", function(entry){  // make tooltip appear
            const service = d3.select(this.parentNode).datum().key;
            const average = entry.data.totalAvg;
            const serviceAvg = entry.data[service];

            tooltip
                .style("display", "block")
                .html(`
                    <h3>Age: ${entry.data.age}</h3>
                    <ul>
                        <li><p class="">
                            <strong>Total Average (Hours):</strong> ${d3.format(".2f")(average)}
                        </p></li>
                        <li><p>
                            <strong>Service:</strong> ${service}
                        </p></li>
                        <li><p>
                            <strong>Service Average (Hours):</strong> ${d3.format(".2f")(serviceAvg)}
                        </p></li>
                    </ul>
                `)
                .selectAll("ul")
                    .style("padding-inline-start", "13px")
                    .style("margin", `${style.barGraph.tooltip.ul.margin.all}px`)
            ;
            tooltip.select("h3")
                .style("margin", `${style.barGraph.tooltip.h3.margin.all}px`)
            ;
            tooltip.selectAll("li").select("p")
                .style("margin", `${style.barGraph.tooltip.p.margin.all}px`)
            ;
            tooltip.select("li:last-child").select("p")
                .style("margin-bottom", `${style.barGraph.tooltip.p.margin.bottom}px`)
            ;
        })
        .on("mousemove", function(){  // update tooltip position
            tooltip
                .style('left', (d3.event.pageX + style.barGraph.tooltip.offset.x) + 'px')
                .style('top', (d3.event.pageY + style.barGraph.tooltip.offset.y) + 'px');
        })
        .on('mouseout', function(){  // make tooltip disappear
            tooltip
                .style('display', 'none');
        })
    ;

    // title
    barGraph.append("text")
        .attr("x", style.barGraph.title.offset.x + style.barGraph.content.offset.x)
        .attr("y", style.barGraph.title.offset.y + style.barGraph.content.offset.y)
        .attr("text-anchor", "middle")
        .attr("font-size", style.barGraph.title.size)
        .attr("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(style.barGraph.title.text);

    // legend
    const barGraphLegend = barGraph.append("g")
        .attr("transform", `translate(
            ${style.barGraph.legend.offset.x + style.barGraph.content.offset.x},
            ${style.barGraph.legend.offset.y + style.barGraph.content.offset.y}
        )`)
    ;
    services.forEach((entry, index) => {
        const label = entry;

        const barGraphLegendRow = barGraphLegend.append("g")
            .attr("transform", `translate(0, ${index * (style.barGraph.legend.icon.size.y + style.barGraph.legend.icon.separation)})`);

        barGraphLegendRow.append("rect")
            .attr("width", style.barGraph.legend.icon.size.x)
            .attr("height", style.barGraph.legend.icon.size.y)
            .attr("fill", convert.getServiceColor(label));

        barGraphLegendRow.append("text")
            .attr("x", style.barGraph.legend.icon.size.x + style.barGraph.legend.text.offset.x)
            .attr("y", style.barGraph.legend.text.offset.y)
            .attr("font-size", `${style.barGraph.legend.text.size}px`)
            .attr("text-anchor", style.barGraph.legend.text.anchor)
            .text(label);
    });
}

///////////////////////////////////////////////////////////////////////////
// scatter plot
//      x:  age
//      y:  hours per day
///////////////////////////////////////////////////////////////////////////
function createScatterPlot(dataset){
    // get unique services
    const services = extractUniqueEntriesFromCategory(dataset, "primary_streaming_service");
    console.log("services", services);

    // create area for scatterplot
    const scatterPlot = svg.append("g")
        .attr("width", style.scatterPlot.width)
        .attr("height", style.scatterPlot.height)
        .attr("transform", `translate(${style.scatterPlot.offset.x}, ${style.scatterPlot.offset.y})`)
        .attr("style", debugStyle) 
        .classed("scatterPlot", true)
    ;

    // x range
    const scatterPlotX = d3.scaleLinear()
        .domain([
            d3.min(dataset, entry => entry.age)-1,
            d3.max(dataset, entry => entry.age)+1
        ])
        .range([0, style.scatterPlot.width])
    ;

    // x axis visual
    const scatterPlotTicksX = d3.axisBottom(scatterPlotX);
    scatterPlot.append("g")
        .attr("transform", `translate(${style.scatterPlot.content.offset.x}, ${style.scatterPlot.height + style.scatterPlot.content.offset.y})`)
        .call(scatterPlotTicksX)
        .attr("font-size", `${style.scatterPlot.ticks.size}px`)
    ;

    // y range
    const datasetMaxY = d3.max(dataset, entry => entry.hours_per_day);
    const scatterPlotY = d3.scaleLinear()
        .domain([0, datasetMaxY + 1])
        .range([style.scatterPlot.height, 0])
        .nice();

    // y axis visual
    const scatterPlotTicksY = d3.axisLeft(scatterPlotY).ticks(datasetMaxY/2);
    scatterPlot.append("g")
        .attr("transform", `translate(${style.scatterPlot.content.offset.x}, ${style.scatterPlot.content.offset.y})`)
        .call(scatterPlotTicksY)
    ;

    // x label
    scatterPlot.append("text")
        .attr("x", style.scatterPlot.labels.x.offset.x + style.scatterPlot.content.offset.x)
        .attr("y", style.scatterPlot.labels.x.offset.y + style.scatterPlot.content.offset.y)
        .attr("font-size", `${style.scatterPlot.labels.size}px`)
        .attr("text-anchor", "middle")
        .text(style.scatterPlot.labels.x.text);

    // y label
    scatterPlot.append("text")
        .attr("x", style.scatterPlot.labels.y.offset.y - style.scatterPlot.content.offset.y)
        .attr("y", style.scatterPlot.labels.y.offset.x + style.scatterPlot.content.offset.x)
        .attr("font-size", `${style.scatterPlot.labels.size}px`)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(style.scatterPlot.labels.y.text);
    
    // points
    scatterPlot.append("g")
        .selectAll("point")
        .data(dataset)
        .join("circle")
        .attr("cx", entry => scatterPlotX(entry.age))
        .attr("cy", entry => scatterPlotY(entry.hours_per_day))
        .attr("r", style.scatterPlot.points.size.default)
        .attr("transform", `translate(${style.scatterPlot.content.offset.x}, ${style.scatterPlot.content.offset.y})`)
        .attr("fill", entry => convert.getServiceColor(entry.primary_streaming_service))
        .on("mouseover", function(entry){
            // tooltip stuff
            tooltip
                .style("display", "block")
                .html(`
                    <h3>Age: ${entry.age}</h3>
                    <ul>
                        <li><p>
                            <strong>Service:</strong> ${entry.primary_streaming_service}
                        </p></li>
                        <li><p>
                            <strong>Hours Listened per Day:</strong> ${entry.hours_per_day}
                        </p></li>
                        <li><p>
                            <strong>Favorite Genre:</strong> ${entry.fav_genre}
                        </p></li>
                    </ul>
                `)
                .selectAll("ul")
                    .style("padding-inline-start", "13px")
                    .style("margin", `${style.scatterPlot.tooltip.ul.margin.all}px`)
            ;
            tooltip.select("h3")
                .style("margin", `${style.scatterPlot.tooltip.h3.margin.all}px`)
            ;
            tooltip.selectAll("li").select("p")
                .style("margin", `${style.scatterPlot.tooltip.p.margin.all}px`)
            ;
            tooltip.select("li:last-child").select("p")
                .style("margin-bottom", `${style.scatterPlot.tooltip.p.margin.bottom}px`)
            ;
            
            // point stuff
            d3.selectAll("circle")
                .transition()
                .duration(style.transitionTime)
                .attr("r", style.scatterPlot.points.size.unfocused)
                .style("opacity", style.scatterPlot.points.opacity.unfocused)
            ;

            d3.select(this)
                .transition()
                .duration(style.transitionTime)
                .attr("r", style.scatterPlot.points.size.focused)
                .style("opacity", style.scatterPlot.points.opacity.focused)
            ;
        })
        .on("mousemove", function(){  // update tooltip position
            tooltip
                .style('left', (d3.event.pageX + style.scatterPlot.tooltip.offset.x) + 'px')
                .style('top', (d3.event.pageY + style.scatterPlot.tooltip.offset.y) + 'px');
        })
        .on('mouseout', function(){  // make tooltip disappear
            tooltip
                .style('display', 'none');
            
            d3.selectAll("circle")
                .transition()
                .duration(style.transitionTime)
                .attr("r", style.scatterPlot.points.size.default)
                .style("opacity", style.scatterPlot.points.opacity.default)
        })
    ;

    // title
    scatterPlot.append("text")
        .attr("x", style.scatterPlot.title.offset.x + style.scatterPlot.content.offset.x)
        .attr("y", style.scatterPlot.title.offset.y + style.scatterPlot.content.offset.y)
        .attr("text-anchor", "middle")
        .attr("font-size", style.scatterPlot.title.size)
        .attr("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(style.scatterPlot.title.text);

    // legend
    const barGraphLegend = scatterPlot.append("g")
        .attr("transform", `translate(
            ${style.scatterPlot.legend.offset.x + style.scatterPlot.content.offset.x},
            ${style.scatterPlot.legend.offset.y + style.scatterPlot.content.offset.y}
        )`)
    ;
    services.forEach((entry, index) => {
        const label = entry;

        const barGraphLegendRow = barGraphLegend.append("g")
            .attr("transform", `translate(0, ${index * (style.scatterPlot.legend.icon.size.y + style.scatterPlot.legend.icon.separation)})`);

        barGraphLegendRow.append("rect")
            .attr("width", style.scatterPlot.legend.icon.size.x)
            .attr("height", style.scatterPlot.legend.icon.size.y)
            .attr("fill", convert.getServiceColor(label));

        barGraphLegendRow.append("text")
            .attr("x", style.scatterPlot.legend.icon.size.x + style.scatterPlot.legend.text.offset.x)
            .attr("y", style.scatterPlot.legend.text.offset.y)
            .attr("font-size", `${style.scatterPlot.legend.text.size}px`)
            .attr("text-anchor", style.scatterPlot.legend.text.anchor)
            .text(label);
    });
}

///////////////////////////////////////////////////////////////////////////
// parallel coordinatees plot
//      service
//      frequency_genre 
// interaction:  selection (click category to keep it highlighted)
//             & brushing (brush over the numerical axes to filter)
// transition:  filtering (only shows clicked categories if any are clicked)
///////////////////////////////////////////////////////////////////////////
function createParallelPlot(dataset){
    // trim dataset to what we need
    const parallelData = dataset.map(entry => {
        return {
            "fav_genre": convert.genreToNum(entry.fav_genre),
            "anxiety": entry.anxiety,
            "depression": entry.depression,
            "insomnia": entry.insomnia,
            "ocd": entry.ocd
        }
    });
    const parallelCategories = [
        "fav_genre", "anxiety", "depression", "insomnia", "ocd"
    ];

    const genres = extractUniqueEntriesFromCategory(dataset, "fav_genre").sort();
    console.log("genres", genres);

    // parallel coordinates container
    const parallel = svg.append("g")
        .attr("width", style.parallel.width)
        .attr("height", style.parallel.height)
        .attr("transform", `translate(${style.parallel.offset.x}, ${style.parallel.offset.y})`)
        .attr("style", debugStyle)
    ;

    // x scale
    const parallelX = d3.scalePoint()
        .range([0, style.parallel.width])
        .padding(1)
        .domain(parallelCategories)
    ;
        
    // y scale
    const parallelY = {};
    parallelCategories.forEach(genre => {  
        parallelY[genre] = d3.scaleLinear()
            .domain([0, 10])  // anxiety, depresssion, insomnia, and ocd are from 0-10
            .range([style.parallel.height, 0]);
    });
    parallelY["fav_genre"] = d3.scaleLinear()
        .domain([  // genres are on ID form so we can use that for the numerical range
            d3.max(parallelData, entry => entry.fav_genre),
            d3.min(parallelData, entry => entry.fav_genre)
        ])
        .range([style.parallel.height, 0]);

    // line definition
    function path(d) {
        return d3.line()(
            parallelCategories.map(genre => [
                parallelX(genre),
                parallelY[genre](d[genre])
            ])
        );
    }

    // draw lines
    parallel.selectAll("parallelLines")
        .data(parallelData)
        .enter().append("path")
        .attr("transform", `translate(${style.parallel.content.offset.x}, ${style.parallel.content.offset.y})`)
        .attr("class", entry => `line ${convert.numToGenre(entry.fav_genre)}`)
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", entry => convert.getMusicGenreColor(entry.fav_genre))
        .style("opacity", style.parallel.line.opacity.default)
        .style("stroke-width", `${style.parallel.line.width.default}px`)
        .classed("clicked", true)
    ;

    let parallelAxesWithSelection = {};  // boolean set
    let parallelSelectionsMade = 0;
    function isLineSelected(line){
        // get the axes this line is selected in
        const axesLineSelectedIn = {};
        parallelCategories.forEach(category => {
            axesLineSelectedIn[category] = line.classed(`selected-${category}`);
        });

        // determine if line is selected in all axes with a selection
        let lineIsSelected = true;
        d3.keys(parallelAxesWithSelection).forEach(category => {
            if(parallelAxesWithSelection[category] && !axesLineSelectedIn[category]){
                lineIsSelected = false;
            }
        });

        return lineIsSelected;
    }

    let userIsHovering = false;
    function updateLines(){
        d3.selectAll(".line").select(function(){
            const line = d3.select(this);
            const lineIsClicked = line.classed("clicked");
            const lineIsSelected = isLineSelected(line);
            const lineIsHovered = line.classed("isHovered");

            // update style
            if(lineIsClicked && lineIsSelected && !lineIsHovered && userIsHovering){
                line.transition().duration(style.transitionTime)
                    .style("opacity", style.parallel.line.opacity.unfocused)
                    .style("stroke-width", `${style.parallel.line.width.unfocused}px`);
            }
            else if(lineIsHovered){  // hovered
                line.transition().duration(style.transitionTime)
                    .style("opacity", style.parallel.line.opacity.focused)
                    .style("stroke-width", `${style.parallel.line.width.focused}px`);
            }
            else if(lineIsClicked && lineIsSelected){
                line.transition().duration(style.transitionTime)
                    .style("opacity", style.parallel.line.opacity.default)
                    .style("stroke-width", `${style.parallel.line.width.default}px`);
            }
            
            else{
                line.transition().duration(style.transitionTime)
                    .style("opacity", 0)
                    .style("stroke-width", `${0}px`);
            }
        });
    }

    // draw axis
    const axes = parallel.selectAll("parallelAxis")
        .data(parallelCategories)
        .enter().append("g")
        .attr("transform", entry => `translate(${parallelX(entry) + style.parallel.content.offset.x}, ${style.parallel.content.offset.y})`)
        .each(function(entry, index) {
            const axis = d3.select(this);
            
            if(index === 0){  // the first tick set is for the genres, so it displays text instead of numbers
                setFirstAxis(axis, entry);
            }
            else{  // the rest are numbers so no other logic needed
                axis.call(d3.axisLeft(parallelY[entry])
                    .ticks(10)  // scores are from 0-10
                );
            }

            axis.attr("font-size", `${style.parallel.labels.y.size}px`);
        })
        .append("text")  // the names of the categories for each vertical axis thing
            .attr("x", style.parallel.labels.x.offset.x)
            .attr("y", style.parallel.labels.x.offset.y)
            .text(entry => entry.replaceAll("_", " "))
            .style("text-anchor", "middle")
            .style("fill", "black")
            .style("font-size", `${style.parallel.labels.x.size}px`)
        ;
    
    function setFirstAxis(axis, entry){
        axis.call(d3.axisLeft(parallelY[entry])
            .ticks(genres.length)
            .tickFormat(tick => genres[tick-1].replaceAll("_", " "))  // tick is a number and genre IDs start at 1
        );

        // legend combined with tick labels
        axis.selectAll(".tick").each(function(genreID, index, ticks){
            const tick = d3.select(ticks[index]);
            tick.on("mouseover", function(tickName){
                    // make all lines of this genre focused if they are selected, if there is a selection
                    const targetObjects = 
                        ".line" +
                        "." + convert.numToGenre(tickName) +
                        (parallelSelectionsMade>0? ".selected" : "")
                    ;
                    d3.selectAll(targetObjects).each(function(){
                        const line = d3.select(this);

                        if(isLineSelected(line)){
                            line.classed("isHovered", true);
                            userIsHovering = true;
                        }
                    });
                    
                    updateLines();
                })
                .on("mouseout", function(){  // make lines normal when cursor leaves
                    d3.selectAll(".isHovered").classed("isHovered", false);
                    userIsHovering = false;
                    
                    updateLines();
                })
                .on("click", function(tickName){  // apply click class
                    d3.selectAll(".line." + convert.numToGenre(tickName)).select(function(){
                        const line = d3.select(this);
                        const isClicked = line.classed("clicked");
                        line.classed("clicked", !isClicked);

                        d3.select(`.genre${tickName}-hole`)
                            .attr("opacity", isClicked? 1 : 0);
                    });

                    updateLines();
                })
            ;
            
            // tick label
            tick.select("text")
                .attr("transform", `translate(-${style.parallel.legend.icon.size.x}, 0)`)
                .style("cursor", "pointer")
            ;

            // legend icon
            tick.append("rect")
                .attr("transform", `translate(
                    -${style.parallel.legend.icon.size.x + style.parallel.legend.icon.offset.x},
                    -${style.parallel.legend.icon.size.y/2}
                )`)
                .attr("width", style.parallel.legend.icon.size.x)
                .attr("height", style.parallel.legend.icon.size.y)
                .attr("fill", convert.getMusicGenreColor(genreID))
                .style("cursor", "pointer")
            ;

            // legend icon hole
            tick.append("rect")
                .attr("transform", `translate(
                    -${style.parallel.legend.icon.size.x*3/4 + style.parallel.legend.icon.offset.x},
                    -${style.parallel.legend.icon.size.y/4 + style.parallel.legend.icon.offset.y}
                )`)
                .attr("width", style.parallel.legend.icon.size.x/2)
                .attr("height", style.parallel.legend.icon.size.y/2)
                .attr("fill", "white")
                .attr("pointer-events", "none")
                .attr("class", `genre${genreID}-hole`)
                .attr("opacity", 0)
            ;
        });
    }

    // brush selection for each axis
    axes.each(function(axisLabel, index) {
        if(index == 0)  return;  // skip first axis
        
        const brush = d3.brushY()
            .extent([
                [-style.parallel.brush.width/2, -10],
                [style.parallel.brush.width/2, style.parallel.height+10]
            ])
            .on("end", function() {
                const selection = d3.event.selection;

                if(selection){
                    const axisSelectedRangeStart = selection[0];
                    const axisSelectedRangeEnd = selection[1];
                    
                    parallel.selectAll(".clicked")
                        .classed(`selected-${axisLabel}`, function(axisValues){
                            const line = d3.select(this);
                            const value = parallelY[axisLabel](axisValues[axisLabel]);
                            const selectedInThisAxis = (
                                value >= axisSelectedRangeStart &&
                                value <= axisSelectedRangeEnd
                            );
                            line.classed("selected", selectedInThisAxis);

                            return selectedInThisAxis;
                        });
                }

                parallelAxesWithSelection[axisLabel] = (selection !== null);
                
                parallelSelectionsMade = 0;
                d3.values(parallelAxesWithSelection).forEach(function(hasSelection){
                    if(hasSelection)  parallelSelectionsMade++;
                });

                updateLines();
            });
        
        // "this" is the label, so its parent is the axis element
        d3.select(this.parentNode)
            .append("g")
            .call(brush)
        ;
        // style brush
        d3.selectAll(".selection")
            .style("fill", style.parallel.brush.color)
            .style("fill-opacity", style.parallel.brush.opacity)
            .style("stroke", style.parallel.brush.stroke.color)
            .style("stroke-width", style.parallel.brush.stroke.width)
        ;
    });
    
    // title
    parallel.append("text")
        .attr("x", style.parallel.title.offset.x + style.parallel.content.offset.x)
        .attr("y", style.parallel.title.offset.y + style.parallel.content.offset.y)
        .attr("text-anchor", "middle")
        .attr("font-size", style.parallel.title.size)
        .attr("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(style.parallel.title.text);
}

///////////////////////////////////////////////////////////////////////////
// donut chart
//      ring: music_effects
///////////////////////////////////////////////////////////////////////////
function createDonutChart(dataset){
    let donutData = {"Improve": 0, "No effect": 0, "Worsen": 0, "N/A": 0};
    dataset.forEach(entry => {
        if(entry.music_effects == ""){
            donutData["N/A"]++;
            return;
        }

        donutData[entry.music_effects]++;
    });
    donutData = Object.entries(donutData);

    console.log("donutData", donutData);

    // tooltip messages
    const statusToSentence = {
        "Improve": "said music has <strong>improved</strong> their mental health.",
        "No effect": "said music has <strong>not affected</strong> their mental health.",
        "Worsen": "said music has <strong>worsened</strong> their mental health.",
        "N/A": "didn't submit an answer."
    };

    // define donut
    const pie = d3.pie()
        .value(entry => entry[1]);  // [[key, value]. [key, value], ...]
    const piedData = pie(donutData);
    const arc = d3.arc()
        .innerRadius(style.donut.radius * 0.7)  // donut hole size
        .outerRadius(style.donut.radius)
    ;

    // donut container
    const donut = svg.append("g")
        .attr("transform", `translate(
            ${style.donut.offset.x},
            ${style.donut.offset.y}
        )`)
        .attr("style", debugStyle) 
    ;

    // draw donut
    donut.selectAll("donut")
        .data(piedData)
        .join("path")
        .attr("d", arc)
        .attr("class", "donutSlice")
        .attr("opacity", style.donut.slice.opacity.default)
        .attr("fill", entry => convert.getEffectColor(entry.data[0]))  // [0] = category name, [1] = value
        .on("mouseover", function(entry){  // show tooltip and emphasize slice under cursor
            const amount = entry.data[1];
            const status = entry.data[0];

            d3.selectAll(".donutSlice")
                .transition()
                .duration(style.transitionTime)
                .style("opacity", style.donut.slice.opacity.unfocused)
            ;

            d3.select(this)
                .transition()
                .duration(style.transitionTime)
                .style("opacity", style.donut.slice.opacity.focused)
            ;

            tooltip
                .style("padding", "10px")
                .style("display", "block")
                .html(`
                    <p><strong>${amount}</strong> people ${statusToSentence[status]}</p>
                `)
                .selectAll("p")
                    .style("margin", `${style.donut.tooltip.p.margin.all}px`)
            ;
        })
        .on("mousemove", function(){  // update tooltip position
            tooltip
                .style('left', (d3.event.pageX + style.donut.tooltip.offset.x) + 'px')
                .style('top', (d3.event.pageY + style.donut.tooltip.offset.y) + 'px');
        })
        .on('mouseout', function(){  // make tooltip disappear and donut slices normal
            d3.selectAll(".donutSlice")
                .transition()
                .duration(style.transitionTime)
                .style("opacity", style.donut.slice.opacity.default)
            ;

            tooltip
                .style('display', 'none');
        })
    ;

    // add count labels
    donut.append("g")
        .attr("font-family", "sans-serif")
        .attr("text-anchor", "middle")
        .selectAll()
        .data(piedData)
        .join("text")
        .attr("transform", entry => `translate(${arc.centroid(entry)})`)
        .call(text => text.append("tspan")
            .text(entry => entry.data[1]))
            .style("pointer-events", "none")
            .style("fill", "black")
            .style("font-size", `${style.donut.slice.text.size}px`)
    ;

    // title
    donut.append("text")  // line 1
        .attr("transform", `translate(${style.donut.title.offset.x}, ${style.donut.title.offset.y})`)
        .attr("text-anchor", "middle")
        .attr("font-size", style.donut.title.size)
        .attr("font-weight", "bold")
        .text("Music's Effects");
    donut.append("text")  // line 2
        .attr("transform", `translate(${style.donut.title.offset.x}, ${style.donut.title.offset.y + 25})`)
        .attr("text-anchor", "middle")
        .attr("font-size", style.donut.title.size)
        .attr("font-weight", "bold")
        .text("on");
    donut.append("text")  // line 3
        .attr("transform", `translate(${style.donut.title.offset.x}, ${style.donut.title.offset.y + 25*2})`)
        .attr("text-anchor", "middle")
        .attr("font-size", style.donut.title.size)
        .attr("font-weight", "bold")
        .text("Subjects' Mental");
    donut.append("text")  // line 4
        .attr("transform", `translate(${style.donut.title.offset.x}, ${style.donut.title.offset.y + 25*3})`)
        .attr("text-anchor", "middle")
        .attr("font-size", style.donut.title.size)
        .attr("font-weight", "bold")
        .text("Health");
    // can probably be refactored since all of the aspects are the same aside from position and text

    // legend
    const donutLegend = donut.append("g")
        .attr("transform", `translate(
            ${style.donut.legend.offset.x},
            ${style.donut.legend.offset.y}
        )`
    );
    donutData.forEach((entry, index) => {
        const label = entry[0];

        // legend container
        const donutLegendRow = donutLegend.append("g")
            .attr("transform", `translate(0, ${index * (style.donut.legend.icon.size.y + style.donut.legend.icon.separation)})`);

        // legend icon (colored square)
        donutLegendRow.append("rect")
            .attr("width", style.donut.legend.icon.size.x)
            .attr("height", style.donut.legend.icon.size.y)
            .attr("fill", convert.getEffectColor(label));

        // legend text
        donutLegendRow.append("text")
            .attr("x", style.donut.legend.text.offset.x)
            .attr("y", style.donut.legend.text.offset.y)
            .attr("font-size", `${style.donut.legend.text.size}px`)
            .attr("text-anchor", style.donut.legend.text.anchor)
            .text(label);
    });
}
