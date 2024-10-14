import React, { useEffect } from "react";

const StatisticsDashboard = () => {
  useEffect(() => {
    window.location.href =
      "https://lookerstudio.google.com/embed/reporting/8bc3f0af-eafb-495b-9cb3-ca6ecf33e1bd/page/2eC7D";
  }, []);

  return (
    <div>
      <h2>Redirecting to Statistics Dashboard...</h2>
    </div>
  );
};

export default StatisticsDashboard;
