import { xml } from '../../xml';
import { featureXML } from './feature-xml-tag';

export function createHtmlPreviewContextPrompt(): string {
  return featureXML({
    name: 'HTML Preview',
    description: 'You can embed HTML content with interactive data visualizations, statistical analysis, and charts using markdown HTML tags. When presenting data analysis results, prefer visual representations using appropriate chart types. Choose vector-based charts (SVG) for complex interactions and smaller datasets, or canvas-based charts for larger datasets and better performance.',
    children: [
      xml('rules', {
        children: [
          xml('rule', {
            attributes: { critical: 'true' },
            children: ['CRITICAL: Every diagram MUST contain complete HTML skeleton with DOCTYPE, html, head, and body tags - no shortcuts allowed'],
          }),
          xml('rule', {
            attributes: { critical: 'true' },
            children: ['CRITICAL: All <script> tags must be placed in the <head> section - no exceptions allowed'],
          }),
          xml('rule', { children: ['Avoid calling getContext() on non-canvas elements'] }),
          xml('rule', { children: ['Place charts and visualizations before their descriptive text'] }),
          xml('rule', { children: ['All HTML must be self-contained with no local file dependencies'] }),
          xml('rule', { children: ['Include all JavaScript code inline using <script> tags'] }),
          xml('rule', { children: ['Include all CSS styles inline using <style> tags'] }),
          xml('rule', { children: ['External libraries must be loaded from CDN sources only'] }),
          xml('rule', { children: ['Prefer popular CDNs like cdnjs, unpkg, or jsdelivr'] }),
          xml('rule', { children: ['When presenting data analysis, use canvas-based libraries like Chart.js'] }),
          xml('rule', { children: ['Ensure canvas elements have proper width and height attributes'] }),
          xml('rule', { children: ['Ensure visualizations are responsive and properly sized'] }),
          xml('rule', { children: ['Always provide fallback content in case JavaScript is disabled'] }),
          xml('rule', { children: ['For data analysis results, combine charts with brief textual explanations below'] }),
          xml('rule', { children: ['Place charts at the beginning of the section, followed by explanatory text'] }),
          xml('rule', { children: ['Centerize your visualizations and text properly using flex, they must be centered on the page'] }),
          xml('rule', { children: ['Initialize charts and visualizations on load document event'] }),
          xml('chart-choice', {
            attributes: { type: 'vector' },
            children: [
              xml('name', { children: ['Vector-based charts (like Plotly)'] }),
              xml('cases', {
                children: [
                  xml('case', { children: ['Complex interactions and tooltips'] }),
                  xml('case', { children: ['Smaller datasets requiring precise rendering'] }),
                  xml('case', { children: ['When SVG export capability is needed'] }),
                ],
              }),
            ],
          }),
          xml('chart-choice', {
            attributes: { type: 'canvas' },
            children: [
              xml('name', { children: ['Canvas-based charts (like Chart.js)'] }),
              xml('cases', {
                children: [
                  xml('case', { children: ['Large datasets with many data points'] }),
                  xml('case', { children: ['When performance is critical'] }),
                  xml('case', { children: ['Simpler interactions and basic tooltips'] }),
                ],
              }),
            ],
          }),
        ],
      }),
      xml('examples', {
        children: [
          xml('example', {
            attributes: {
              description: 'Example of a canvas-based chart',
            },
            children: [
              `\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    .chart-container { width: 100%; text-align: center; padding: 20px; }
    canvas { max-width: 600px; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
    window.addEventListener('load', function() {
      const ctx = document.getElementById('myChart').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Analysis A', 'Analysis B', 'Analysis C'],
          datasets: [{
            data: [19, 26, 55],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }]
        }
      });
    });
  </script>
</head>
<body>
  <div class="chart-container">
    <canvas id="myChart" width="500" height="400"></canvas>
  </div>
</body>
</html>
\`\`\``,
            ],
          }),
          xml('example', {
            attributes: {
              description: 'Example of a vector-based chart using Plotly',
            },
            children: [
              `\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    .chart-container { width: 100%; text-align: center; padding: 20px; }
  </style>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <script>
    window.addEventListener('load', function() {
      const data = [{
        values: [19, 26, 55],
        labels: ['Analysis A', 'Analysis B', 'Analysis C'],
        type: 'pie',
        marker: {
          colors: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      }];
      const layout = {
        height: 400,
        width: 600,
        showlegend: true
      };
      Plotly.newPlot('plotlyChart', data, layout);
    });
  </script>
</head>
<body>
  <div class="chart-container">
    <div id="plotlyChart" style="width: 500px; height: 400px; margin: 0 auto;"></div>
  </div>
</body>
</html>
\`\`\``,
            ],
          }),
        ],
      }),
    ],
  });
}
