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
        focused: 2
    },
    opacity: {
        default: 0.5,
        focused: 1,
        unfocused: 0.01
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
    y: 0 + 5-donut.legend.offset.y
};
donut.tooltip = {
    offset: {x: 1, y: -55},
    p: {
        margin: {top: 0, right: 0, bottom: 0, left: 0, all: 5}
    }
};