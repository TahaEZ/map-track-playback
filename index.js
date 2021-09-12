var map = L.map('map').setView([32.4279, 53.6880], 5);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=lEqvCb2Wy9NVtR1tA9Z7', {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    attribution: "\u003ca href=\"https://www.maptiler.com/copyright/\" target=\"_blank\"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e",
    crossOrigin: true
}).addTo(map)

function setCursor(e) {
    trackplayback.setCursor(e.target.time)
}

let options = {
    clockOptions: {
        speed: 17,
        maxSpeed: 65
    },
    trackPointOptions: {
        isDraw: true,
        useCanvas: true,
        stroke: false,
        color: '#ef0300',
        fill: true,
        fillColor: '#ef0300',
        opacity: 0.6,
        radius: 4
    },
    trackLineOptions: {
        isDraw: true,
        stroke: true,
        color: '#1C54E2',
        weight: 2,
        fill: false,
        fillColor: '#000',
        opacity: 0.4
    },
    targetOptions: {
        useImg: false,
        width: 8,
        height: 18,
        color: '#000000',
        fillColor: '#000000'
    }
}

let container = document.getElementById('visualization')
let timelineItems = new vis.DataSet(data.map(city => {
    return {id: city.id, content: city.info[0].name, start: new Date(city.time)}
}))
const startTime = new Date(data[0].time)
const endTime = new Date(data[data.length - 1].time)
let timelineOptions = {
    // "axisOnTop": true,
    end: endTime,
    start: startTime,
    "style": "box",
    "showCustomTime": true
}
let timeline = new vis.Timeline(container, timelineItems, timelineOptions);

timeline.setCustomTime(data[0].time);
let trackplayback = L.trackplayback(data, map, options);
const trackplaybackControl = L.trackplaybackcontrol(trackplayback);
trackplaybackControl.addTo(map);
const playPauseBtn = document.querySelector("#play-pause")
trackplayback.on('tick', e => {
    let cities = document.querySelectorAll('#timeline-control span')
    for (city of cities) {
        if (city.time <= e.time) {
            city.style.color = 'black'
        } else {
            city.style.color = 'red'
        }
    }
    timeline.setCustomTime(new Date(e.time));
    if (e.time >= endTime.getTime()) {
        playPauseBtn.innerHTML = 'Play'
    }
}, this)

timeline.on('timechange', onCustomTimeChange);
timeline.on('select', onSelectItems)

function onCustomTimeChange(properties) {
    trackplayback.setCursor(properties.time.getTime());
}

function onSelectItems(properties) {
    if (properties.items[0]) {
        console.log(properties.items)
        itemId = properties.items[0]
        city = data.find(e => e.id == itemId)
        trackplayback.setCursor(city.time)
    }
}

document.querySelector('#replay').onclick = replay

function replay(e) {
    trackplayback.rePlaying()
    playPauseBtn.innerHTML = 'Pause'
}

playPauseBtn.onclick = play

function play(e) {
    if (e.target.innerHTML == 'Play') {
        if (trackplayback.getCurTime() <= endTime.getTime()) {
            trackplayback.start()
            e.target.innerHTML = 'Pause'
        }
    } else if (e.target.innerHTML == 'Pause') {
        trackplayback.stop()
        e.target.innerHTML = 'Play'
    }
}