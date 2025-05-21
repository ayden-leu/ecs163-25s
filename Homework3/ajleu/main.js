let width = window.innerWidth;
let height = window.innerHeight;

const dataset = "./data/mxmh_survey_results.csv";
const datasetBpmMax = 300;
const datasetHoursMax = 24;
const debugStyle = "" //"outline: 1px solid black"
;
const barGraphOffset = {"x": 10, "y": 10},
    barGraphWidth = width/2,
    barGraphHeight = height/3
;
const barGraphTextLabelX = "Age",
    barGraphTextLabelY = "Average Hours Per Day",
    barGraphTextLabelXOffset = {"x": 0 + barGraphWidth/2, "y": 40 + barGraphHeight},
    barGraphTextLabelYOffset = {"x": -30, "y": -barGraphHeight/2},
    barGraphTextSizeLabel = 20,
    barGraphTextSizeTicks = 10,
    barGraphLegendIconSize = {"x": 20, "y": 20},
    barGraphLegendOffset = {"x": -10 + barGraphLegendIconSize.x, "y": 0},
    barGraphLegendIconSeparation = 5,
    barGraphLegendTextOffset = {"x": 25 + -barGraphLegendIconSize.x, "y": 15},
    barGraphLegendTextSize = 15,
    barGraphLegendTextAnchor = "start",
    barGraphTitle = "Hours Listened on Service by Various Ages",
    barGraphTitleOffset = {"x": 0 + barGraphWidth/2, "y": -10},
    barGraphTitleSize = "1.5em"
;
const barTooltipOffset = {"x": 1, "y": -131},
    barTooltipMargin_h3 = {top: 0, right: 0, bottom: 0, left: 0, all: 0},
    barTooltipMargin_ul = {top: 0, right: 0, bottom: 0, left: 0, all: 5},
    barTooltipMargin_p = {top: 10, right: 0, bottom: 10, left: 0, all: 5}
;
const barGraphContentShift = {"x": 45, "y": 30}; // needed to "fix" the random padding
const barGraphTotalTranslation = {
    "x": barGraphContentShift.x + barGraphOffset.x,
    "y": barGraphContentShift.y + barGraphOffset.y
};

const parallelOffset = {"x": 5, "y": 50 + barGraphTotalTranslation.y + barGraphHeight},
    parallelWidth = Math.min(width, Math.max(
        1250,
        293 + barGraphWidth,
    )),
    parallelHeight = 80 + height/3
;
const parallelTextLabelsXSize = 20,
    parallelTextLabelsYSize = (width > 1280)? 0 : 15,
    parallelTextLabelsXOffset = {"x": 0, "y": "-1em"},
    parallelLineWidthDefault = 1,
    parallelLineWidthFocused = 2,
    parallelLineOpacityDefault = 0.5,
    parallelLineOpacityFocused = 1,
    parallelLineOpacityUnfocused = 0.01,
    parallelLegendOffset = {
        "x": (width > 1280)? 180 : 0,
        "y": -9},
    parallelLegendIconSize = {"x": 20, "y": 20},
    parallelLegendIconSeparation = 6,
    parallelLegendTextSize = 15,
    parallelLegendTextOffset = {"x": -5, "y": 13},
    parallelLegendTextAnchor = "end",
    parallelTitle = "Relation of Genre to Self-Reported Aspects",
    parallelTitleOffset = {"x": -40 + parallelWidth/2, "y": -45},
    parallelTitleSize = "1.5em"
;
const parallelContentShift = {"x": -44, "y": 72}; // needed to "fix" the random padding

console.log("width", width);

const donutRadius = 185,
    donutTextSize = 15,
    donutSliceOpacityDefault = 1,
    donutSliceOpacityFocused = 1,
    donutSliceOpacityUnfocused = 0.3,
    donutLegendOffset = {"x": -25 + -donutRadius, "y": -25 + -donutRadius},
    donutLegendIconSize = {"x": 20, "y": 20},
    donutLegendIconSeparation = 6,
    donutLegendTextSize = 15,
    donutLegendTextOffset = {"x": 25, "y": 12},
    donutLegendTextAnchor = "start",
    donutTitleOffset = {"x": 0, "y": -25},
    donutTitleSize = "1.5em"
;
const donutWidth = width/2,
    donutHeight = donutWidth,
    donutOffset = {
        "x": 80 + barGraphWidth + -donutLegendOffset.x,
        "y": 0 + 5-donutLegendOffset.y}
;
const donutTooltipOffset = {"x": 1, "y": -55},
    donutTooltipMargin_p = {top: 0, right: 0, bottom: 0, left: 0, all: 5}
;

const transitionTime = 100;

function getServiceColor(platform){
    const serviceColor = {
        "Spotify": "lightgreen",
        "Pandora": "deepskyblue",
        "YouTube Music": "salmon",
        "Apple Music": "gainsboro",
        "Other": "gray"
    };
    return serviceColor[platform] || "lightslategray";
}
function getMusicGenreColor(genre){
    if(typeof genre === "number") genre = numToGenre(genre);

    const musicGenreColor = {
        "Classical": "gray",
        "Country": "orange",
        "EDM": "blue",
        "Folk": "brown",
        "Gospel": "gold",
        "Hip_hop": "mediumvioletred",
        "Jazz": "indigo",
        "K_pop": "green",
        "Latin": "red",
        "Lofi": "hotpink",
        "Metal": "silver",
        "Pop": "magenta",
        "R_and_B": "indianred",
        "Rap": "cyan",
        "Rock": "slategray",
        "Video_game_music": "purple"
    };
    return musicGenreColor[genre] || "white";
}
function getEffectColor(effect){
    const effectColor = {
        "Improve": "limegreen",
        "No effect": "lightgray",
        "Worsen": "orangered",
        "N/A": "lightslategray"
    };
    return effectColor[effect] || "black";
}

function genreToNum(genre){
    const genreToNum = {
        "Classical": 1,
        "Country": 2,
        "EDM": 3,
        "Folk": 4,
        "Gospel": 5,
        "Hip_hop": 6,
        "Jazz": 7,
        "K_pop": 8,
        "Latin": 9,
        "Lofi": 10,
        "Metal": 11,
        "Pop": 12,
        "R_and_B": 13,
        "Rap": 14,
        "Rock": 15,
        "Video_game_music": 16
    };
    return genreToNum[genre] || 0;
}
function numToGenre(genre){
    const numToGenre = {
        1: "Classical",
        2: "Country",
        3: "EDM",
        4: "Folk",
        5: "Gospel",
        6: "Hip_hop",
        7: "Jazz",
        8: "K_pop",
        9: "Latin",
        10: "Lofi",
        11: "Metal",
        12: "Pop",
        13: "R_and_B",
        14: "Rap",
        15: "Rock",
        16: "Video_game_music"
    };
    return numToGenre[genre] || "huh";
}



// requirements
// three visualizations for the dataset
//      at least one advanced visualization
//      one should be an overview of the dataset
//      different dimensions or aspects of the dataset
//      three visualizations should fit on a fullscreen browser
//      legends, axis labels, chart titles

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
            "frequency_video_game_music": entry.frequency_video_game_music,
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

// plots
d3.csv(dataset).then(rawData =>{
    console.log("rawData", rawData);

    // process raw data
    const processedData = processRawData(rawData);
    console.log("processedData", processedData);

    // extract entries from somecategories for later
    const services = extractUniqueEntriesFromCategory(processedData, "primary_streaming_service");
    const genres = extractUniqueEntriesFromCategory(processedData, "fav_genre").sort();

    console.log("services", services);
    console.log("genres", genres);
    

    // main contianer
    const svg = d3.select("svg");
    
    // tooltip
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


    ///////////////////////////////////////////////////////////////////////////
    // stacked bar chart
    //      x:  service
    //      y:  age
    ///////////////////////////////////////////////////////////////////////////

    // get total hours listened to music for each age
    let totalHoursEntriesPerAge = {};
    processedData.forEach(function(entry){
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
        .attr("width", barGraphWidth)
        .attr("height", barGraphHeight)
        .attr("transform", `translate(${barGraphOffset.x}, ${barGraphOffset.y})`)
        .attr("style", debugStyle) 
    ;

    // bar stack
    const stackedBars = d3.stack().keys(services);   // stacks the data
    const stackedData = stackedBars(flattenedData);  // based on services
    console.log("stackedData", stackedData);

    // x range
    const barGraphX = d3.scaleBand()
        .domain(averageHoursPerAge.map(entry => entry.age))
        .range([0, barGraphWidth])
        .padding(0.2);

    // x axis visual
    const barGraphTicksX = d3.axisBottom(barGraphX);
    barGraph.append("g")
        .attr("transform", `translate(${barGraphContentShift.x}, ${barGraphHeight + barGraphContentShift.y})`)
        .call(barGraphTicksX)
        .attr("font-size", `${barGraphTextSizeTicks}px`);

    // y range
    const stackedDataMaxY = d3.max(
        stackedData, layer => d3.max(
            layer, entry => entry[1]
        )
    );
    const barGraphY = d3.scaleLinear()
        .domain([0, stackedDataMaxY + 1])
        .range([barGraphHeight, 0])
        .nice();

    // y axis visual
    const barGraphTicksY = d3.axisLeft(barGraphY).ticks(stackedDataMaxY/2);
    barGraph.append("g")
        .attr("transform", `translate(${barGraphContentShift.x}, ${barGraphContentShift.y})`)
        .call(barGraphTicksY)
    ;

    // x label
    barGraph.append("text")
        .attr("x", barGraphTextLabelXOffset.x + barGraphContentShift.x)
        .attr("y", barGraphTextLabelXOffset.y + barGraphContentShift.y)
        .attr("font-size", `${barGraphTextSizeLabel}px`)
        .attr("text-anchor", "middle")
        .text(barGraphTextLabelX);

    // y label
    barGraph.append("text")
        .attr("x", barGraphTextLabelYOffset.y - barGraphContentShift.y)
        .attr("y", barGraphTextLabelYOffset.x + barGraphContentShift.x)
        .attr("font-size", `${barGraphTextSizeLabel}px`)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(barGraphTextLabelY);
    
    // bars
    barGraph.selectAll("barGraph")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("transform", `translate(${barGraphContentShift.x}, ${barGraphContentShift.y})`)
        .attr("class", "layer")
        .attr("fill", entry => getServiceColor(entry.key))
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
                    .style("margin", `${barTooltipMargin_ul.all}px`)
            ;
            tooltip.select("h3")
                .style("margin", `${barTooltipMargin_h3.all}px`)
            ;
            tooltip.selectAll("li").select("p")
                .style("margin", `${barTooltipMargin_p.all}px`)
            ;
            tooltip.select("li:last-child").select("p")
                .style("margin-bottom", `${barTooltipMargin_p.bottom}px`)
            ;
        })
        .on("mousemove", function(){  // update tooltip position
            tooltip
                .style('left', (d3.event.pageX + barTooltipOffset.x) + 'px')
                .style('top', (d3.event.pageY + barTooltipOffset.y) + 'px');
        })
        .on('mouseout', function(){  // make tooltip disappear
            tooltip
                .style('display', 'none');
        })
    ;

    // title
    barGraph.append("text")
        .attr("x", barGraphTitleOffset.x + barGraphContentShift.x)
        .attr("y", barGraphTitleOffset.y + barGraphContentShift.y)
        .attr("text-anchor", "middle")
        .attr("font-size", barGraphTitleSize)
        .attr("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(barGraphTitle);
    
    // legend
    const barGraphLegend = barGraph.append("g")
        .attr("transform", `translate(
            ${barGraphLegendOffset.x + barGraphContentShift.x},
            ${barGraphLegendOffset.y + barGraphContentShift.y}
        )`)
    ;
    services.forEach((entry, index) => {
        const label = entry;

        const barGraphLegendRow = barGraphLegend.append("g")
            .attr("transform", `translate(0, ${index * (barGraphLegendIconSize.y + barGraphLegendIconSeparation)})`);

        barGraphLegendRow.append("rect")
            .attr("width", barGraphLegendIconSize.x)
            .attr("height", barGraphLegendIconSize.y)
            .attr("fill", getServiceColor(label));

        barGraphLegendRow.append("text")
            .attr("x", barGraphLegendIconSize.x + barGraphLegendTextOffset.x)
            .attr("y", barGraphLegendTextOffset.y)
            .attr("font-size", `${barGraphLegendTextSize}px`)
            .attr("text-anchor", barGraphLegendTextAnchor)
            .text(label);
    });


    ///////////////////////////////////////////////////////////////////////////
    // parallel coordinatees plot
    //      service
    //      frequency_genre 
    ///////////////////////////////////////////////////////////////////////////
    const parallelData = processedData.map(entry => {  // only get data we need
        return {
            "fav_genre": genreToNum(entry.fav_genre),
            "bpm": entry.bpm,
            "anxiety": entry.anxiety,
            "depression": entry.depression,
            "insomnia": entry.insomnia,
            "ocd": entry.ocd
        }
    });
    const parallelCategories = [
        "fav_genre", "anxiety", "depression", "insomnia", "ocd"
    ];

    // parallel coordinates container
    const parallel = svg.append("g")
        .attr("width", parallelWidth)
        .attr("height", parallelHeight)
        .attr("transform", `translate(${parallelOffset.x}, ${parallelOffset.y})`)
        .attr("style", debugStyle)
    ;

    // x scale
    const parallelX = d3.scalePoint()
        .range([0, parallelWidth])
        .padding(1)
        .domain(parallelCategories)
    ;
        
    // y scale
    const parallelY = {};
    parallelCategories.forEach(genre => {  
        parallelY[genre] = d3.scaleLinear()
            .domain([0, 10])  // anxiety, depresssion, insomnia, and ocd are from 0-10
            .range([parallelHeight, 0]);
    });
    parallelY["fav_genre"] = d3.scaleLinear()
        .domain([  // genres are on ID form so we can use that for the numerical range
            d3.max(parallelData, entry => entry.fav_genre),
            d3.min(parallelData, entry => entry.fav_genre)
        ])
        .range([parallelHeight, 0]);
    
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
        .attr("transform", `translate(${parallelContentShift.x}, ${parallelContentShift.y})`)
        .attr("class", entry => `line ${numToGenre(entry.fav_genre)}`)
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", entry => getMusicGenreColor(entry.fav_genre))
        .style("opacity", parallelLineOpacityDefault)
        .style("cursor", "pointer")
        .on("mouseover", function(entry){  // emphasize line below cursor
            d3.selectAll(".line")
                .transition()
                .duration(transitionTime)
                .style("opacity", parallelLineOpacityUnfocused);
            
            d3.selectAll(".line." + numToGenre(entry.fav_genre))
                .transition()
                .duration(transitionTime)
                .style("opacity", parallelLineOpacityFocused)
                .style("stroke-width", parallelLineWidthFocused);
        })
        .on('mouseout', function(){  // make lines normal when cursor leaves
            d3.selectAll(".line")
                .transition()
                .duration(transitionTime)
                .style("opacity", parallelLineOpacityDefault)
                .style("stroke-width", parallelLineWidthDefault);
        })
    ;

    // draw axis
    parallel.selectAll("parallelAxis")
        .data(parallelCategories)
        .enter().append("g")
        .attr("transform", entry => `translate(${parallelX(entry) + parallelContentShift.x}, ${parallelContentShift.y})`)
        .each(function(entry, index) {
            const axis = d3.select(this);
            
            if(index === 0){  // the first tick set is for the genres, so it displays text instead of numbers
                axis.call(d3.axisLeft(parallelY[entry])
                    .ticks(genres.length)
                    .tickFormat(tick => genres[tick-1].replaceAll("_", " "))  // tick is a number and genre IDs start at 1
                );

                axis.selectAll(".tick text")
                    .on("mouseover", function(tickName){  // emphasize the lines belonging to the genre below the cursor
                        d3.selectAll(".line")
                            .transition()
                            .duration(transitionTime)
                            .style("opacity", parallelLineOpacityUnfocused);
                        
                        d3.selectAll(".line." + numToGenre(tickName))
                            .transition()
                            .duration(transitionTime)
                            .style("opacity", parallelLineOpacityFocused)
                            .style("stroke-width", parallelLineWidthFocused);
                    })
                    .on('mouseout', function(){  // make lines normal when cursor leaves
                        d3.selectAll(".line")
                            .transition()
                            .duration(transitionTime)
                            .style("opacity", parallelLineOpacityDefault)
                            .style("stroke-width", parallelLineWidthDefault);
                    })
                ;
            }
            else{  // the rest are numbers so no other logic needed
                axis.call(d3.axisLeft(parallelY[entry])
                    .ticks(10)  // scores are from 0-10
                );
            }

            axis.attr("font-size", `${parallelTextLabelsYSize}px`);
        })
        .append("text")  // the names of the categories for each vertical axis thing
            .style("text-anchor", "middle")
            .attr("x", 5)
            .attr("y", 5)
            .text(entry => entry.replaceAll("_", " "))
            .style("fill", "black")
            .style("font-size", `${parallelTextLabelsXSize}px`)
            .attr("x", parallelTextLabelsXOffset.x)
            .attr("y", parallelTextLabelsXOffset.y);
    
    // title
    parallel.append("text")
        .attr("x", parallelTitleOffset.x + parallelContentShift.x)
        .attr("y", parallelTitleOffset.y + parallelContentShift.y)
        .attr("text-anchor", "middle")
        .attr("font-size", parallelTitleSize)
        .attr("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text(parallelTitle);
    
    // legend
    const parallelLegend = parallel.append("g")
        .attr("transform", `translate(
            ${parallelLegendOffset.x + parallelContentShift.x},
            ${parallelLegendOffset.y + parallelContentShift.y}
        )`
    );
    genres.forEach((entry, index) => {
        const label = entry;

        // legend row container
        const parallelLegendRow = parallelLegend.append("g")
            .attr("transform", `translate(0, ${index * (parallelLegendIconSize.y + parallelLegendIconSeparation)})`);

        // legend "icon" (colored square)
        parallelLegendRow.append("rect")
            .attr("width", parallelLegendIconSize.x)
            .attr("height", parallelLegendIconSize.y)
            .attr("fill", getMusicGenreColor(label))
            .style("cursor", "pointer")
            .on("mouseover", function(){  // emphasize lines of the same color as the square below cursor
                d3.selectAll(".line")
                    .transition()
                    .duration(transitionTime)
                    .style("opacity", parallelLineOpacityUnfocused);
                
                d3.selectAll(".line." + entry)
                    .transition()
                    .duration(transitionTime)
                    .style("opacity", parallelLineOpacityFocused)
                    .style("stroke-width", parallelLineWidthFocused);
            })
            .on('mouseout', function(){  // make lines normal when cursor leaves
                d3.selectAll(".line")
                    .transition()
                    .duration(transitionTime)
                    .style("opacity", parallelLineOpacityDefault)
                    .style("stroke-width", parallelLineWidthDefault);
            })
        ;
        
        // legend text
        parallelLegendRow.append("text")
            .attr("x", parallelLegendTextOffset.x)
            .attr("y", parallelLegendTextOffset.y)
            .attr("font-size", `${parallelLegendTextSize}px`)
            .attr("text-anchor", parallelLegendTextAnchor)
            .text(label.replaceAll("_", " "))
            .style("cursor", "pointer")
            .on("mouseover", function(){  // emphasize lines belonging to the same genre as the text below cursor
                d3.selectAll(".line")
                    .transition()
                    .duration(transitionTime)
                    .style("opacity", parallelLineOpacityUnfocused);
                
                d3.selectAll(".line." + entry)
                    .transition()
                    .duration(transitionTime)
                    .style("opacity", parallelLineOpacityFocused)
                    .style("stroke-width", parallelLineWidthFocused);
            })
            .on('mouseout', function(){ // make lines normal when cursor leaves
                d3.selectAll(".line")
                    .transition()
                    .duration(transitionTime)
                    .style("opacity", parallelLineOpacityDefault)
                    .style("stroke-width", parallelLineWidthDefault);
            })
        ;
    });
    


    ///////////////////////////////////////////////////////////////////////////
    // donut chart
    //      ring: music_effects
    ///////////////////////////////////////////////////////////////////////////

    let donutData = {"Improve": 0, "No effect": 0, "Worsen": 0, "N/A": 0};
    processedData.forEach(entry => {
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
        .innerRadius(donutRadius * 0.7)  // donut hole size
        .outerRadius(donutRadius)
    ;

    // donut container
    const donut = svg.append("g")
        .attr("transform", `translate(
            ${donutOffset.x},
            ${donutOffset.y}
        )`)
        .attr("style", debugStyle) 
    ;

    // draw donut
    donut.selectAll("donut")
        .data(piedData)
        .join("path")
        .attr("d", arc)
        .attr("class", "donutSlice")
        .attr("opacity", donutSliceOpacityDefault)
        .attr("fill", entry => getEffectColor(entry.data[0]))  // [0] = category name, [1] = value
        .on("mouseover", function(entry){  // show tooltip and emphasize slice under cursor
            const amount = entry.data[1];
            const status = entry.data[0];

            d3.selectAll(".donutSlice")
                .transition()
                .duration(transitionTime)
                .style("opacity", donutSliceOpacityUnfocused)
            ;

            d3.select(this)
                .transition()
                .duration(transitionTime)
                .style("opacity", donutSliceOpacityFocused)
            ;

            tooltip
                .style("padding", "10px")
                .style("display", "block")
                .html(`
                    <p><strong>${amount}</strong> people ${statusToSentence[status]}</p>
                `)
                .selectAll("p")
                    .style("margin", `${donutTooltipMargin_p.all}px`)
            ;
        })
        .on("mousemove", function(){  // update tooltip position
            tooltip
                .style('left', (d3.event.pageX + donutTooltipOffset.x) + 'px')
                .style('top', (d3.event.pageY + donutTooltipOffset.y) + 'px');
        })
        .on('mouseout', function(){  // make tooltip disappear and donut slices normal
            d3.selectAll(".donutSlice")
                .transition()
                .duration(transitionTime)
                .style("opacity", donutSliceOpacityDefault)
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
            .style("font-size", `${donutTextSize}px`)
    ;
    
    // title
    donut.append("text")  // line 1
        .attr("transform", `translate(${donutTitleOffset.x}, ${donutTitleOffset.y})`)
        .attr("text-anchor", "middle")
        .attr("font-size", donutTitleSize)
        .attr("font-weight", "bold")
        .text("Music's Effects");
    donut.append("text")  // line 2
        .attr("transform", `translate(${donutTitleOffset.x}, ${donutTitleOffset.y + 25})`)
        .attr("text-anchor", "middle")
        .attr("font-size", donutTitleSize)
        .attr("font-weight", "bold")
        .text("on");
    donut.append("text")  // line 3
        .attr("transform", `translate(${donutTitleOffset.x}, ${donutTitleOffset.y + 25*2})`)
        .attr("text-anchor", "middle")
        .attr("font-size", donutTitleSize)
        .attr("font-weight", "bold")
        .text("Subjects' Mental");
    donut.append("text")  // line 4
        .attr("transform", `translate(${donutTitleOffset.x}, ${donutTitleOffset.y + 25*3})`)
        .attr("text-anchor", "middle")
        .attr("font-size", donutTitleSize)
        .attr("font-weight", "bold")
        .text("Health");
    // can probably be refactored since all of the aspects are the same aside from position and text
    
    // legend
    const donutLegend = donut.append("g")
        .attr("transform", `translate(
            ${donutLegendOffset.x},
            ${donutLegendOffset.y}
        )`
    );
    donutData.forEach((entry, index) => {
        const label = entry[0];

        // legend container
        const donutLegendRow = donutLegend.append("g")
            .attr("transform", `translate(0, ${index * (donutLegendIconSize.y + donutLegendIconSeparation)})`);

        // legend icon (colored square)
        donutLegendRow.append("rect")
            .attr("width", donutLegendIconSize.x)
            .attr("height", donutLegendIconSize.y)
            .attr("fill", getEffectColor(label));

        // legend text
        donutLegendRow.append("text")
            .attr("x", donutLegendTextOffset.x)
            .attr("y", donutLegendTextOffset.y)
            .attr("font-size", `${donutLegendTextSize}px`)
            .attr("text-anchor", donutLegendTextAnchor)
            .text(label);
    });

    }).catch(function(error){
    console.log(error);
});