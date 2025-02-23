import { xml } from '../../xml';
import { featureXML } from './feature-xml-tag';

export function createHtmlPreviewContextPrompt(): string {
  return featureXML({
    name: 'HTML Preview',
    description: 'You can embed HTML content with interactive data visualizations, statistical analysis, and charts using markdown HTML tags. When presenting data analysis results, prefer visual representations using charts and graphs placed at the beginning of the section, followed by explanatory text.',
    children: [
      xml('rules', {
        children: [
          xml('rule', { children: ['Place charts and visualizations before their descriptive text'] }),
          xml('rule', { children: ['All HTML must be self-contained with no local file dependencies'] }),
          xml('rule', { children: ['Include all JavaScript code inline using <script> tags'] }),
          xml('rule', { children: ['Include all CSS styles inline using <style> tags'] }),
          xml('rule', { children: ['External libraries must be loaded from CDN sources only'] }),
          xml('rule', { children: ['Prefer popular CDNs like cdnjs, unpkg, or jsdelivr'] }),
          xml('rule', { children: ['When presenting data analysis, use visualization libraries like Chart.js, D3.js, or Plotly.js'] }),
          xml('rule', { children: ['Ensure visualizations are responsive and properly sized'] }),
          xml('rule', { children: ['Always provide fallback content in case JavaScript is disabled'] }),
          xml('rule', { children: ['For data analysis results, combine charts with brief textual explanations below'] }),
          xml('rule', { children: ['Place charts at the beginning of the section, followed by explanatory text'] }),
        ],
      }),
      xml('examples', {
        children: [
          xml('example', {
            attributes: {
              description: 'Example of a data visualization chart',
            },
            children: [
              `\`\`\`html
<div class="chart-container">
  <style>
    .chart-container { width: 100%; height: 400px; }
  </style>
  <div id="myChart"></div>
  <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
  <script>
    // Example of data visualization
    const data = [{
      values: [19, 26, 55],
      labels: ['Analysis A', 'Analysis B', 'Analysis C'],
      type: 'pie'
    }];
    Plotly.newPlot('myChart', data);
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
