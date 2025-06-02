import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import axios from 'axios';

function Reports() {
  const [averageTimes, setAverageTimes] = useState(null);
  const [ticketsSummary, setTicketsSummary] = useState([]);
  const [topAgents, setTopAgents] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const avgTimesResponse = await axios.get('/reports/average-times');
      setAverageTimes(avgTimesResponse.data);

      const ticketsSummaryResponse = await axios.get('/reports/tickets-summary');
      setTicketsSummary(ticketsSummaryResponse.data);

      const topAgentsResponse = await axios.get('/reports/top-agents');
      setTopAgents(topAgentsResponse.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const ticketsData = {
    labels: ticketsSummary.map((item) => `${item.status} - ${item.priority}`),
    datasets: [
      {
        label: 'Tickets by Status and Priority',
        data: ticketsSummary.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const agentsData = {
    labels: topAgents.map((agent) => agent.agent_name),
    datasets: [
      {
        label: 'Top Performing Agents',
        data: topAgents.map((agent) => agent.tickets_resolved),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {averageTimes && (
        <div className="mb-4">
          <h2 className="text-xl font-bold">Average Resolution Time</h2>
          <p>{averageTimes.average_resolution_time} minutes</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold">Tickets Summary</h2>
        <Bar data={ticketsData} />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold">Top Performing Agents</h2>
        <Pie data={agentsData} />
      </div>
    </div>
  );
}

export default Reports;
