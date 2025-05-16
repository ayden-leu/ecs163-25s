const width = window.innerWidth;
const height = window.innerHeight;
    
let barGraphLeft = 0, barGraphTop = 40;
let barGraphMargin = {top: 10, right: 0, bottom: 30, left: 70},
    barGraphWidth = Math.max(
        1000,
        width/2 - barGraphMargin.left - barGraphMargin.right
    ),
    barGraphHeight = Math.max(
        300,
        height/3 - barGraphMargin.top - barGraphMargin.bottom
    );

let parallelLeft = 0, parallelTop = 180 + barGraphHeight;
let parallelMargin = {top: 10, right: 0, bottom: 30, left: -100},
    parallelWidth = Math.max(
        850,
        width/2 - parallelMargin.left - parallelMargin.right
    ),
    parallelHeight = height/3 + height/6 - parallelMargin.top - parallelMargin.bottom;

let donutLeft = -100 + parallelWidth, donutTop = -90 + barGraphHeight;
let donutMargin = {top: 200, right: 0, bottom: 0, left: 0},
    donutWidth = width - parallelWidth - donutMargin.left - donutMargin.right,
    donutHeight = parallelHeight - donutMargin.top - donutMargin.bottom;

const dataset = "./data/mxmh_survey_results.csv";
const datasetBpmMax = 300;
const datasetHoursMax = 24;

const barGraphTextLabelX = "Age";
const barGraphTextLabelY = "Average Hours Per Day";
const barGraphTextSizeLabel = "20px";
const barGraphTextSizeTicks = "10px";
const barGraphTextLabelXOffsetY = 50;
const barGraphTextLabelYOffsetY = -40;
const tooltipOffsetX = 1;
const tooltipOffsetY = -140;

const parallelTextLabelSizeX = "15px";
const donutTextTitleSize = "1.5em";
const parallelLineWidthDefault = 1;
const parallelLineWidthFocused = 2;
const parallelLineOpacityDefault = 0.5;
const parallelLineOpacityUnfocused = 0.01;



const donutRadius = 230;

function getServiceColor(platform){
    if(platform == "Spotify") return "lightgreen";
    if(platform == "Pandora") return "lightblue";
    if(platform == "YouTube Music") return "salmon";
    if(platform == "Apple Music") return "lightgray";
    if(platform == "Other") return "purple";
    else return "black";
}
function getMusicGenreColor(genre){
    if(typeof genre === "number") genre = numToGenre(genre);

    if(genre == "Classical") return "gray";
    if(genre == "Country") return "orange";
    if(genre == "EDM") return "purple";
    if(genre == "Folk") return "firebrick";
    if(genre == "Gospel") return "gold";
    if(genre == "Hip_hop") return "darkblue";
    if(genre == "Jazz") return "blue";
    if(genre == "K_pop") return "green";
    if(genre == "Latin") return "darkgreen";
    if(genre == "Lofi") return "steelblue";
    if(genre == "Metal") return "black";
    if(genre == "Pop") return "magenta";
    if(genre == "R_and_B") return "lightblue";
    if(genre == "Rap") return "cyan";
    if(genre == "Rock") return "lightgray";
    if(genre == "Video_game_music") return "orange";
    else return "white";
}
function getEffectColor(effect){
    if(effect == "Improve") return "limegreen";
    if(effect == "No effect" || effect == "") return "lightgray";
    if(effect == "Worsen") return "orangered";
    if(effect == "N/A") return "lightslategray";
    else return "black";
}

function musicEffectToNum(effect){
    if(effect == "Improve") return 1;
    if(effect == "No effect" || effect == "") return 0;
    if(effect == "Worsen") return -1;
    else return 0;
}
function numToMusicEffect(effect){
    if(effect == 1) return "Improve";
    if(effect == 0) return "No effect";
    if(effect == -1) return "Worsen";
    else return "huh";
}

function frequencyToNum(freq){
    if(freq == "Very frequently") return 3;
    if(freq == "Sometimes") return 2;
    if(freq == "Rarely") return 1;
    if(freq == "Never") return 0;
    else return -1;
}
function numToFrequency(freq){
    if(freq == 3) return "Very frequently";
    if(freq == 2) return "Sometimes";
    if(freq == 1) return "Rarely";
    if(freq == 0) return "Never";
    else return "huh";
}

function genreToNum(genre){
    if(genre == "Classical") return 1;
    if(genre == "Country") return 2;
    if(genre == "EDM") return 3;
    if(genre == "Folk") return 4;
    if(genre == "Gospel") return 5;
    if(genre == "Hip_hop") return 6;
    if(genre == "Jazz") return 7;
    if(genre == "K_pop") return 8;
    if(genre == "Latin") return 9;
    if(genre == "Lofi") return 10;
    if(genre == "Metal") return 11;
    if(genre == "Pop") return 12;
    if(genre == "R_and_B") return 13;
    if(genre == "Rap") return 14;
    if(genre == "Rock") return 15;
    if(genre == "Video_game_music") return 16;
    else return 0;
}
function numToGenre(genre){
    if(genre == 1) return "Classical";
    if(genre == 2) return "Country";
    if(genre == 3) return "EDM";
    if(genre == 4) return "Folk";
    if(genre == 5) return "Gospel";
    if(genre == 6) return "Hip_hop";
    if(genre == 7) return "Jazz";
    if(genre == 8) return "K_pop";
    if(genre == 9) return "Latin";
    if(genre == 10) return "Lofi";
    if(genre == 11) return "Metal";
    if(genre == 12) return "Pop";
    if(genre == 13) return "R_and_B";
    if(genre == 14) return "Rap";
    if(genre == 15) return "Rock";
    if(genre == 16) return "Video_game_music";
    else return "huh";
}
const musicGenres = [
    "", "Classical", "Country", "EDM", "Folk", "Gospel", "Hip_hop",
    "Jazz", "K_pop", "Latin", "Lofi", "Metal", "Pop", "R_and_B",
    "Rap", "Rock", "Video_game_music"
];

// requirements
// three visualizations for the dataset
//      at least one advanced visualization
//      one should be an overview of the dataset
//      different dimensions or aspects of the dataset
//      three visualizations should fit on a fullscreen browser
//      legends, axis labels, chart titles

// plots
d3.csv(dataset).then(rawData =>{
    console.log("rawData", rawData);

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
        // entry.music_effects = musicEffectToNum(entry.music_effects);
    });
    const filteredData = rawData.filter(entry => 
        entry.bpm <= datasetBpmMax && 
        entry.primary_streaming_service !== "" &&
        entry.hours_per_day < datasetHoursMax &&
        entry.age !== 0
    );
    const processedData = filteredData.map(entry=>{
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
    console.log("processedData", processedData);

    
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


    ////////////////////////////////
    // bar chart
    //      x:  service
    //      y:  age

    // extract relevant data
    let avgHoursPerServicePerAge = {};
    let services = new Set();
    processedData.forEach(function(entry){
        const age = entry.age;
        const service = entry.primary_streaming_service;
        const hours = entry.hours_per_day;
        
        // get all services in dataset
        services.add(service);
        // get totals for each service for each age
        if(!avgHoursPerServicePerAge[age]){
            avgHoursPerServicePerAge[age] = {"totalHours": 0, "count": 0};
        }
        if(!avgHoursPerServicePerAge[age][service]){
            avgHoursPerServicePerAge[age][service] = 0;
        }
        // avgHoursPerServicePerAge[age][service].totalHours += hours;
        avgHoursPerServicePerAge[age][service]++;
        avgHoursPerServicePerAge[age].totalHours += hours;
        avgHoursPerServicePerAge[age].count++;
    });
    services = Array.from(services);

    console.log("services", services);
    console.log("avgHoursPerServicePerAge", avgHoursPerServicePerAge);

    let avgHoursPerServicePerAgeArray = [];
    Object.keys(avgHoursPerServicePerAge).forEach(ageEntry => {
        const newEntry = {"age": ageEntry, "avgHours": 0, "services": {}};
        
        const total = avgHoursPerServicePerAge[ageEntry].totalHours;
        const count = avgHoursPerServicePerAge[ageEntry].count;
        newEntry.avgHours = total / count;
        
        services.forEach(serviceEntry => {
            const serviceCount = avgHoursPerServicePerAge[ageEntry][serviceEntry] || 0;
            newEntry.services[serviceEntry] = serviceCount;
        });
        avgHoursPerServicePerAgeArray.push(newEntry);
    });

    console.log("avgHoursPerServicePerAgeArray", avgHoursPerServicePerAgeArray);

    // calculate how much each service contributes to the average
    avgHoursPerServicePerAgeArray.forEach(entry => {
        let total = 0;
        Object.keys(entry.services).forEach(service => {
            total += entry.services[service];
        });
        
        Object.keys(entry.services).forEach(service => {
            entry.services[service] = entry.services[service] / total * entry.avgHours;
        }); 
    });
    console.log("avgHoursPerServicePerAgeArray", avgHoursPerServicePerAgeArray)


    // flatten data so stack can use it
    const flattenedData = avgHoursPerServicePerAgeArray.map(entry => {
        const newEntry = {"age": entry.age, "totalAvg": entry.avgHours};
        services.forEach(service => {
            newEntry[service] = entry.services[service] || 0;  // || 0 is for if there is no value for a service
        });

        return newEntry;
    });

    console.log("flattenedData", flattenedData);

    // create area for bar graph
    const barGraph = svg.append("g")
        .attr("width", barGraphWidth + barGraphMargin.left + barGraphMargin.right)
        .attr("height", barGraphHeight + barGraphMargin.top + barGraphMargin.bottom)
        .attr("transform", `translate(${barGraphMargin.left}, ${barGraphTop})`)
        .attr("style", "outline: 1px solid black") 
    ;

    // bar stack
    const stackedBars = d3.stack().keys(services);
    const stackedData = stackedBars(flattenedData);
    
    console.log("stackedData", stackedData);

    // X range
    const barGraphX = d3.scaleBand()
        .domain(avgHoursPerServicePerAgeArray.map(entry => entry.age))
        .range([0, barGraphWidth])
        .padding(0.2);

    // X axis visual
    const barGraphTicksX = d3.axisBottom(barGraphX);
    barGraph.append("g")
        .attr("transform", `translate(0, ${barGraphHeight})`)
        .call(barGraphTicksX)
        .attr("font-size", barGraphTextSizeTicks);

    // Y range
    const barGraphY = d3.scaleLinear()
        .domain([0, d3.max(stackedData, layer => d3.max(layer, entry => entry[1])) + 1])
        .range([barGraphHeight, 0])
        .nice();

    // Y axis visual
    const barGraphTicksY = d3.axisLeft(barGraphY)
        .ticks(6);
    barGraph.append("g").call(barGraphTicksY);

    // X label
    barGraph.append("text")
        .attr("x", barGraphWidth / 2)
        .attr("y", barGraphHeight + barGraphTextLabelXOffsetY)
        .attr("font-size", barGraphTextSizeLabel)
        .attr("text-anchor", "middle")
        .text(barGraphTextLabelX);

    // Y label
    barGraph.append("text")
        .attr("x", -(barGraphHeight / 2))
        .attr("y", barGraphTextLabelYOffsetY)
        .attr("font-size", barGraphTextSizeLabel)
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .text(barGraphTextLabelY);
    
    // bars
    barGraph.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", entry => getServiceColor(entry.key))
        .selectAll("rect")
        .data(entry => entry)
        .enter()
        .append("rect")
        .attr("x", entry => barGraphX(entry.data.age))
        .attr("y", entry => barGraphY(entry[1]))
        .attr("height", entry => barGraphY(entry[0]) - barGraphY(entry[1]))
        .attr("width", barGraphX.bandwidth())
        .on("mouseover", function(entry) {
            const service = d3.select(this.parentNode).datum().key;
            const average = entry.data.totalAvg;
            const serviceAvg = entry.data[service];

            tooltip
                .style("display", "block")
                .html(`
                    <h3 style="margin-bottom:5px; margin-top:5px">Age: ${entry.data.age}</h3>
                    <p style="margin-bottom:5px; margin-top:5px">
                        <strong>Total Average (Hours):</strong> ${d3.format(".2f")(average)}
                    </p>
                    <p style="margin-bottom:5px; margin-top:5px">
                        <strong>Service:</strong> ${service}
                    </p>
                    <p style="margin-top:5px">
                        <strong>Service Average (Hours):</strong> ${d3.format(".2f")(serviceAvg)}
                    </p>
                `);
        })
        .on("mousemove", function(){
            tooltip
                .style('left', (d3.event.pageX + tooltipOffsetX) + 'px')
                .style('top', (d3.event.pageY + tooltipOffsetY) + 'px');
        })
        .on('mouseout', function(){
            tooltip
                .style('display', 'none');
        })
    ;

    // title
    barGraph.append("text")
        .attr("transform", `translate(${0}, ${-10})`)
        .attr("text-anchor", "start")
        .attr("font-size", donutTextTitleSize)
        .attr("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("Hours Listened on Service by Various Ages");
    
    // legend
    const barGraphLegend = barGraph.append("g")
        .attr("transform", `translate(
            ${0},
            ${0}
        )`
    );
    services.forEach((entry, index) => {
        const label = entry;

        const barGraphLegendRow = barGraphLegend.append("g")
            .attr("transform", `translate(0, ${index * 20})`);

        barGraphLegendRow.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", getServiceColor(label));

        barGraphLegendRow.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .attr("font-size", "12px")
            .text(label);
    });

    ///////////////////////////////////////////////////////////////////////////
    // parallel coordinatees plot
    //      service
    //      frequency_genre 
    const parallelData = processedData.map(entry => {
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

    const parallel = svg.append("g")
        .attr("width", parallelWidth + parallelMargin.left + parallelMargin.right)
        .attr("height", parallelHeight + parallelMargin.top + parallelMargin.bottom)
        .attr("transform", `translate(${parallelLeft}, ${parallelTop})`)
        .attr("style", "outline: 1px solid black")
    ;

    // X scale
    const parallelX = d3.scalePoint()
        .range([0, parallelWidth])
        .padding(1)
        .domain(parallelCategories);
        
    // Y scale
    const parallelY = {};
    parallelCategories.forEach(genre => {  // anxiety, depresssion, insomnia, and ocd are from 0-10
        parallelY[genre] = d3.scaleLinear()
            .domain([0, 10])
            .range([parallelHeight, 0]);
    });
    parallelY["fav_genre"] = d3.scaleLinear()
        .domain([
            d3.max(parallelData, entry => entry.fav_genre),
            d3.min(parallelData, entry => entry.fav_genre)
        ])
        .range([parallelHeight, 0]);
    
    // line function
    function path(d) {
        return d3.line()(
            parallelCategories.map(genre => [
                parallelX(genre),
                parallelY[genre](d[genre])
            ])
        );
    }

    // draw lines
    parallel.selectAll("myPath")
        .data(parallelData)
        .enter().append("path")
        .attr("class", entry => `line ${numToGenre(entry.fav_genre)}`)
        .attr("d", path)
        .style("fill", "none")
        .style("stroke", entry => getMusicGenreColor(entry.fav_genre))
        .style("opacity", 1)
        .style("cursor", "pointer")
        .on("mouseover", function(entry) {
            d3.selectAll(".line")
                .style("opacity", parallelLineOpacityUnfocused);
            
            d3.selectAll(".line." + numToGenre(entry.fav_genre))
                .style("opacity", parallelLineOpacityDefault)
                .style("stroke-width", parallelLineWidthFocused);
        })
        .on('mouseout', function(){
            d3.selectAll(".line")
                .style("opacity", parallelLineOpacityDefault)
                .style("stroke-width", parallelLineWidthDefault);
        })
    ;

    // draw axis
    parallel.selectAll("myAxis")
        .data(parallelCategories)
        .enter().append("g")
        .attr("transform", entry => `translate(${parallelX(entry)},0)`)
        .each(function(entry, index) {
            const axis = d3.select(this);
            
            if(index === 0){
                axis.call(d3.axisLeft(parallelY[entry])
                    .ticks(musicGenres.length-1)
                    .tickFormat(tick => musicGenres[tick])
                );

                axis.selectAll(".tick text")
                    .style("cursor", "pointer")
                    .on("mouseover", function(tickName) {
                        d3.selectAll(".line")
                            .style("opacity", parallelLineOpacityUnfocused);
                        
                        d3.selectAll(".line." + numToGenre(tickName))
                            .style("opacity", parallelLineOpacityDefault)
                            .style("stroke-width", parallelLineWidthFocused);
                    })
                    .on('mouseout', function(){
                        d3.selectAll(".line")
                            .style("opacity", parallelLineOpacityDefault)
                            .style("stroke-width", parallelLineWidthDefault);
                    });
            }
            else{
                axis.call(d3.axisLeft(parallelY[entry])
                    .ticks(10)
                );
            }
        })
        .append("text")
            .style("text-anchor", "middle")
            .attr("x", 5)
            .attr("y", 5)
            .text(entry => entry.replace("frequency_", "").replaceAll("_", " "))
            .style("fill", "black")
            .style("font-size", parallelTextLabelSizeX)
            .attr("transform", "translate(0, -10)")
            .attr("dy", "-0.5em");
    
    // title
    parallel.append("text")
        .attr("transform", `translate(${160}, ${-40})`)
        .attr("text-anchor", "start")
        .attr("font-size", donutTextTitleSize)
        .attr("font-weight", "bold")
        .style("font-family", "sans-serif")
        .text("Relation of Genre to Self-Reported Aspects");
    
    // legend
    const parallelLegend = parallel.append("g")
        .attr("transform", `translate(
            ${20},
            ${0}
        )`
    );
    musicGenres.forEach((entry, index) => {
        const label = entry;

        const parallelLegendRow = parallelLegend.append("g")
            .attr("transform", `translate(0, ${index * 20})`);

        parallelLegendRow.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", getMusicGenreColor(label));

        parallelLegendRow.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .attr("font-size", "12px")
            .text(label);
    });
    
    ////////////////////////////////////////
    // donut chart
    //      ring: music_effects

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
    
    // define donut
    const pie = d3.pie()
        .value(entry => entry[1]);  // [[key, value]. [key, value], ...]
    const piedData = pie(donutData);
    const arc = d3.arc()
        .innerRadius(donutRadius * 0.7)  // donut hole size
        .outerRadius(donutRadius)
    ;

    // draw donut
    const donut = svg.append("g")
        .attr("transform", `translate(
            ${donutLeft + donutMargin.left + donutWidth / 2},
            ${donutTop + donutMargin.top + donutHeight / 2}
        )`)
        .attr("style", "outline: 1px solid black") 
    ;
    donut.selectAll("path")
        .data(piedData)
        .join("path")
        .attr("d", arc)
        .attr("fill", entry => getEffectColor(entry.data[0]))
        .append("title")
            .text("hi")
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
            .style("color", "white")
            .style("pointer-events", "none")
            .text(entry => entry.data[1]))
    ;
    
    // title
    donut.append("text")
        .attr("transform", "translate(0, -25)")
        .attr("text-anchor", "middle")
        .attr("font-size", donutTextTitleSize)
        .attr("font-weight", "bold")
        .text("Music's Effects");
    donut.append("text")
        .attr("text-anchor", "middle")
        .attr("font-size", donutTextTitleSize)
        .attr("font-weight", "bold")
        .text("on");
    donut.append("text")
        .attr("transform", "translate(0, 25)")
        .attr("text-anchor", "middle")
        .attr("font-size", donutTextTitleSize)
        .attr("font-weight", "bold")
        .text("Subjects' Mental Health");
    
    // legend
    const donutLegend = donut.append("g")
        .attr("transform", `translate(
            ${-donutWidth / 4 - 30},
            ${-donutHeight - 30}
        )`
    );
    donutData.forEach((entry, index) => {
        const label = entry[0];

        const donutLegendRow = donutLegend.append("g")
            .attr("transform", `translate(0, ${index * 20})`);

        donutLegendRow.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", getEffectColor(label));

        donutLegendRow.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .attr("font-size", "12px")
            .text(label);
    });

    }).catch(function(error){
    console.log(error);
});