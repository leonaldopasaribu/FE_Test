import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { GateData } from '../../../utils/traffic-aggregation';

interface GateChartProps {
  data: GateData[];
}

export default function GateChart({ data }: GateChartProps) {
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
    },
    yaxis: {
      title: {
        text: 'Jumlah Lalin',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toLocaleString() + ' kendaraan';
        },
      },
    },
    colors: ['#10B981'],
  });

  const [series, setSeries] = useState<any[]>([
    {
      name: 'Jumlah Lalin',
      data: [],
    },
  ]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      xaxis: {
        ...prev.xaxis,
        categories: data.map((item) => item.gateName),
      },
    }));

    setSeries([
      {
        name: 'Jumlah Lalin',
        data: data.map((item) => item.count),
      },
    ]);
  }, [data]);

  return (
    <div className="rounded-lg">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
}
