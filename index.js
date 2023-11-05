// The `Streamlit` object exists because our HTML file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.

// Initialize an empty list to store clicked data points
var clickedDataPoints = [];

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onDataFromPython(event) {
  var myPlot = document.getElementById("plot");

  const data = event.detail;

  spec = JSON.parse(data.args.spec);
  console.log(spec);

  /*Plotly.newPlot(plot, [{
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 8, 16]
    }],
        { margin: { t: 0 } }
    );*/
  Plotly.newPlot(myPlot, spec);

  // on event, append clicked data points to the list
  myPlot.on("plotly_click", (eventData) => {
    const clickedPoints = eventData.points.map((p) => {
      return { x: p.x, y: p.y };
    });

    // Append the clicked data points to the list
    clickedDataPoints.push(...clickedPoints);

    // Send the list of all clicked data points to Python
    Streamlit.setComponentValue(clickedDataPoints);
  });

  // Render iframe with the plot height
  Streamlit.setFrameHeight(document.documentElement.clientHeight);
}

// Render the component whenever Python sends a "render event"
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onDataFromPython);

// Tell Streamlit that the component is ready to receive events
Streamlit.setComponentReady();

