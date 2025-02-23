import { xml } from '../../xml';
import { featureXML } from './feature-xml-tag';

export function createHtmlPreviewContextPrompt(): string {
  return featureXML({
    name: 'HTML Preview',
    description: 'You can embed HTML content with interactive data visualizations, statistical analysis, and charts using markdown HTML tags. When presenting data analysis results, prefer visual representations using appropriate chart types. Choose vector-based charts (SVG) for complex interactions and smaller datasets, or canvas-based charts for larger datasets and better performance.',
    children: [
      xml('rules', {
        children: [
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
<div class="chart-container">
  <style>
    .chart-container { width: 100%; text-align: center; padding: 20px; }
    canvas { max-width: 600px; }
  </style>
  <canvas id="myChart" width="600" height="400"></canvas>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script>
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
  </script>
</div>
\`\`\``,
            ],
          }),
          xml('example', {
            attributes: {
              description: 'Example of a vector-based chart using Plotly',
            },
            children: [
              `\`\`\`html
<div class="chart-container">
  <style>
    .chart-container { width: 100%; text-align: center; padding: 20px; }
  </style>
  <div id="plotlyChart" style="width: 600px; height: 400px; margin: 0 auto;"></div>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <script>
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
  </script>
</div>
\`\`\``,
            ],
          }),
        ],
      }),
    ],
  });
}
