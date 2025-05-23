export const width = window.innerWidth;
export const height = window.innerHeight;

export const transitionTime = 100;

export let barGraph = {};
barGraph.offset = {x: 10, y: 10};
barGraph.width = width/2;
barGraph.height = height/3;
barGraph.labels = {
    x: {
        text: "Age",
        offset: {x: 0 + barGraph.width/2, y: 40 + barGraph.height}
    },
    y: {
        text: "Average Hours Per Day",
        offset: {x: -30, y: -barGraph.height/2}
    },
    size: 20
};
barGraph.ticks = {
    size: 10
};
barGraph.legend = {
    icon: {
        size: {x: 20, y: 20},
        separation: 5
    }
};
barGraph.legend.offset = {x: -10 + barGraph.legend.icon.size.x, y: 0};
barGraph.legend.text = {
    offset: {x: 25 + -barGraph.legend.icon.size.x, y: 15},
    size: 15,
    anchor: "start"
};
barGraph.title = {
    text: "Hours Listened on Service by Various Ages",
    offset: {x: 0 + barGraph.width/2, y: -10},
    size: "1.5em"
};
barGraph.tooltip = {
    offset: {x: 1, y: -131},
    h3: {
        margin: {top: 0, right: 0, bottom: 0, left: 0, all: 0}
    },
    ul: {
        margin: {top: 0, right: 0, bottom: 0, left: 0, all: 5}
    },
    p: {
        margin: {top: 10, right: 0, bottom: 10, left: 0, all: 5}
    }
};
barGraph.content = {};
barGraph.content.offset = {x: 45, y: 30};  // needed to "fix" the random padding
barGraph.totalOffset = { 
    x: barGraph.content.offset.x + barGraph.offset.x,
    y: barGraph.content.offset.y + barGraph.offset.y
};


export let scatterPlot = {};
scatterPlot.offset = {x: 10, y: 10};
scatterPlot.width = width/2;
scatterPlot.height = height/3;
scatterPlot.labels = {
    x: {
        text: "Age",
        offset: {x: 0 + scatterPlot.width/2, y: 40 + scatterPlot.height}
    },
    y: {
        text: "Hours Per Day",
        offset: {x: -30, y: -scatterPlot.height/2}
    },
    size: 20
};
scatterPlot.ticks = {
    size: 10
};
scatterPlot.legend = {
    icon: {
        size: {x: 20, y: 20},
        separation: 5
    }
};
scatterPlot.legend.offset = {
    x: scatterPlot.width - scatterPlot.legend.icon.size.x,
    y: 0};
scatterPlot.legend.text = {
    offset: {x: -5 + -scatterPlot.legend.icon.size.x, y: 15},
    size: 15,
    anchor: "end"
};
scatterPlot.title = {
    text: "Hours Listened on Service by Various Ages",
    offset: {x: 0 + scatterPlot.width/2, y: -10},
    size: "1.5em"
};
scatterPlot.tooltip = {
    offset: {x: 1, y: -130},
    h3: {
        margin: {top: 0, right: 0, bottom: 0, left: 0, all: 0}
    },
    ul: {
        margin: {top: 0, right: 0, bottom: 0, left: 0, all: 5}
    },
    p: {
        margin: {top: 10, right: 0, bottom: 10, left: 0, all: 5}
    }
};
scatterPlot.content = {};
scatterPlot.content.offset = {x: 45, y: 30};  // needed to "fix" the random padding
scatterPlot.totalOffset = { 
    x: scatterPlot.content.offset.x + scatterPlot.offset.x,
    y: scatterPlot.content.offset.y + scatterPlot.offset.y
};
scatterPlot.points = {
    size: {
        default: 5,
        focused: 8,
        unfocused: 2
    },
    opacity:{
        default: 1,
        focused: 1,
        unfocused: 0.3
    }
};


export let parallel = {};
parallel.offset = {x: 5, y: 50 + barGraph.totalOffset.y + barGraph.height};
parallel.width = Math.min(width, Math.max(
    1250,
    293 + barGraph.width,
));
parallel.height = 80 + height/3;
parallel.labels = {
    x: {
        size: 20,
        offset: {x: 0, y: "-1em"}
    },
    y: {
        size: 15
    }
};
parallel.line = {
    width: {
        default: 1,
        focused: 2,
        unfocused: 0
    },
    opacity: {
        default: 0.8,
        focused: 1,
        unfocused: 0.2
    }
};
parallel.legend = {
    icon: {
        offset: {x: 5, y: 0},
        size: {x: 15, y: 15},
        separation: 5
    },
    text: {
        offset: {x: -5, y: 13},
        size: 15,
        anchor: "end"
    }
};
parallel.title = {
    text: "Relation of Genre to Self-Reported Aspects",
    offset: {x: -40 + parallel.width/2, y: -45},
    size: "1.5em"
};
parallel.content = {};
parallel.content.offset = {x: -44, y: 72}; // needed to "fix" the random padding
parallel.brush = {
    width: 60,
    color: "gray",
    opacity: 0,
    stroke: {
        width: 2,
        color: "black"
    }
}



export let donut = {};
donut.radius = 185;
donut.slice = {
    text: {
        size: 15
    },
    opacity: {
        default: 1,
        focused: 1,
        unfocused: 0.3
    }
};
donut.legend = {
    offset: {x: -25 + -donut.radius, y: -25 + -donut.radius},
    icon: {
        size: {x: 20, y: 20},
        separation: 6
    },
    text: {
        size: 15,
        offset: {x: 25, y: 12},
        anchor: "start"
    }
};
donut.title = {
    offset: {x: 0, y: -25},
    size: "1.5em"
};
donut.width = width/2;
donut.height = donut.width;
donut.offset = {
    x: 80 + barGraph.width + -donut.legend.offset.x,
    y: 10 + 5-donut.legend.offset.y
};
donut.tooltip = {
    offset: {x: 1, y: -55},
    p: {
        margin: {top: 0, right: 0, bottom: 0, left: 0, all: 5}
    }
};