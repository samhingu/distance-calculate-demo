// routes to be display on vertex selection change
var routes = [];
// vertexList to fill dropdown
var vertexList = [];
var jsonData = {}

// load json file using XMLHttpRequest request
function loadJSON(url) {
    var xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.overrideMimeType('application/json')
    xmlHttpRequest.open('GET', url, true);
    xmlHttpRequest.onreadystatechange = function() {
        console.log("State :" + xmlHttpRequest.readyState);
        if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == "200") {
            setDropdown(xmlHttpRequest.responseText);
        }
    };
    xmlHttpRequest.send(null);
}

// Fill dropdowns using json data.
function setDropdown(data) {
    jsonData = JSON.parse(data);

    for (var key in jsonData) {
        document.getElementById('ddlFrom').appendChild(new Option(key, key));
        document.getElementById('ddlTo').appendChild(new Option(key, key));
        vertexList.push(key)
    }
}

// calculate routes as per selection of Start and End points
// called on dropdown selection change
function calculateRoute() {
    // clear old routes
    routes = [];
    // calculate new routes
    findRoutes(document.getElementById('ddlTo').value, [], 0, document.getElementById('ddlFrom').value)
        // display new routes
    displayRoute()
}

function displayRoute() {
    // sort routes by total distance
    routes.sort(function(a, b) {
        return a.totalDistance - b.totalDistance
    });

    //prepare route html
    var html = ''
    routes.forEach(function(route, pathIndex) {
            html += '<div class="route">'
            route.path.forEach(function(vertex, vertexIndex) {
                html += '<div class="key">' + vertex.key + '</div>';
                if (vertexIndex != route.path.length - 1) {
                    html += '<div class="distance" style="width: ' + route.path[vertexIndex + 1].value * 30 + 'px">' + route.path[vertexIndex + 1].value + '</div>'
                }
            })
            html += '</div>'
        })
        // set route html to display to user
    document.getElementById('content').innerHTML = html
}


function findRoutes(end, intermediatePath, distance, current) {
    // add intermediate vertext to path
    intermediatePath.push({
            key: current,
            value: distance
        })
        // loop through all destination from current vertex
    for (var key in jsonData[current]) {
        // if vertex(key) is already been we pass through then skip it
        if (!intermediatePath.contains(key)) {
            // make shallow copy of array
            var path = intermediatePath.slice(0)
                //if vertex(key) is destination then push it to routes
            if (key == end) {
                path.push({
                    key: key,
                    value: jsonData[current][key][1]
                })
                // calculate total distance
                var totalDistance = 0;
                path.forEach(function(val) {
                    totalDistance += val.value;
                })
                routes.push({
                    path: path,
                    totalDistance: totalDistance
                });
            } else {
                // recursive call findRoutes function
                findRoutes(end, path, jsonData[current][key][1], key)
            }
        }
    }
}
// custom contains extension for array
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i].key === obj) {
            return true;
        }
    }
    return false;
}
loadJSON('test.json')
