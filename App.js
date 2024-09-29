// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';

// function App() {
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch forecast data from Flask backend
//         const response = await axios.get('http://localhost:5000/forecast');
//         setData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // Prepare data for Chart.js
//   const chartData = {
//     labels: Array.from({ length: 50 }, (_, i) => i + 1),  // Forecast time steps (1 to 50)
//     datasets: Object.keys(data).map((parameter, index) => ({
//       label: `Forecasted ${parameter}`,
//       data: data[parameter],
//       borderColor: `rgba(${index * 50}, 99, 132, 1)`,
//       borderWidth: 2,
//       fill: false,
//     })),
//   };

//   return (
//     <div className="App">
//       <h1>Water Quality Forecast</h1>
//       <Line data={chartData} />
//     </div>
//   );
// }

// export default App;
//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';

// function App() {
//   const [data, setData] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch forecast data from Flask backend
//         const response = await axios.get('http://localhost:5000/forecast');
//         setData(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching data: ", error);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="App">
//       <h1>Water Quality Forecast</h1>
//       {Object.keys(data).map((parameter, index) => (
//         <div key={index} style={{ marginBottom: '50px' }}>
//           <h2>{parameter} Forecast</h2>
//           <Line
//             data={{
//               labels: Array.from({ length: 50 }, (_, i) => i + 1), // Time steps
//               datasets: [
//                 {
//                   label: `Forecasted ${parameter}`,
//                   data: data[parameter],
//                   borderColor: `rgba(${index * 50}, 99, 132, 1)`,
//                   borderWidth: 2,
//                   fill: false,
//                 },
//               ],
//             }}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }

// export default App;
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS } from 'chart.js/auto';
// import './App.css'; // Custom styles for better UX

// function App() {
//   const [data, setData] = useState({});
//   const [activeTab, setActiveTab] = useState(''); // Track the active tab
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/forecast');
//         setData(response.data);
//         setActiveTab(Object.keys(response.data)[0]); // Set first parameter as default tab
//         setLoading(false);
//       } catch (error) {
//         console.error('Error fetching data: ', error);
//       }
//     };
//     fetchData();
//   }, []);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   return (
//     <div className="App">
//       <h1 className="title">Water Quality Forecast</h1>
//       <div className="tabs">
//         {Object.keys(data).map((parameter) => (
//           <button
//             key={parameter}
//             className={`tab-button ${activeTab === parameter ? 'active' : ''}`}
//             onClick={() => setActiveTab(parameter)}
//           >
//             {parameter}
//           </button>
//         ))}
//       </div>

//       <div className="tab-content">
//         {Object.keys(data).map((parameter, index) => (
//           <div
//             key={index}
//             className={`tab-panel ${activeTab === parameter ? 'active' : 'hidden'}`}
//           >
//             <h2>{parameter} Forecast</h2>
//             <Line
//               data={{
//                 labels: Array.from({ length: 50 }, (_, i) => i + 1), // Time steps (1 to 50)
//                 datasets: [
//                   {
//                     label: `Forecasted ${parameter}`,
//                     data: data[parameter],
//                     borderColor: `rgba(${index * 50}, 99, 132, 1)`,
//                     borderWidth: 2,
//                     fill: false,
//                   },
//                 ],
//               }}
//               options={{
//                 maintainAspectRatio: false,
//                 scales: {
//                   x: {
//                     title: {
//                       display: true,
//                       text: 'Time Index',
//                     },
//                   },
//                   y: {
//                     title: {
//                       display: true,
//                       text: `${parameter} Value`,
//                     },
//                   },
//                 },
//               }}
//               height={300}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;
//----------------------------------------------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import './App.css';

function App() {
  const [data, setData] = useState({});
  const [activeIndex, setActiveIndex] = useState(0); // Track the active graph index
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/forecast');
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex === 0 ? Object.keys(data).length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex === Object.keys(data).length - 1 ? 0 : prevIndex + 1));
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const parameters = Object.keys(data);
  const activeParameter = parameters[activeIndex];

  return (
    <div className="App">
      <h1 className="title">Water Quality Forecast</h1>

      <div className="carousel">
        <button className="carousel-button" onClick={handlePrev}>
          Previous
        </button>

        <div className="graph-container">
          <h2>{activeParameter} Forecast</h2>
          <Line
            data={{
              labels: Array.from({ length: 50 }, (_, i) => i + 1), // Time steps (1 to 50)
              datasets: [
                {
                  label: `Forecasted ${activeParameter}`,
                  data: data[activeParameter],
                  borderColor: `rgba(75, 192, 192, 1)`,
                  borderWidth: 2,
                  fill: false,
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Time Index',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: `${activeParameter} Value`,
                  },
                },
              },
            }}
            height={300}
          />
        </div>

        <button className="carousel-button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
