import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { ShiftData } from '../../utils/traffic-aggregation';

interface ShiftChartProps {
  data: ShiftData[];
}

export default function ShiftChart({ data }: ShiftChartProps) {
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      type: 'donut',
      height: 350,
    },
    labels: [],
    legend: {
      position: 'bottom',
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return val.toFixed(1) + '%';
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toLocaleString() + ' kendaraan';
        },
      },
    },
    colors: ['#3C50E0', '#6577F3', '#8FD0EF'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function (w) {
                return w.globals.seriesTotals
                  .reduce((a: number, b: number) => a + b, 0)
                  .toLocaleString();
              },
            },
          },
        },
      },
    },
  });

  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    setOptions((prev) => ({
      ...prev,
      labels: data.map((item) => item.shift),
    }));

    setSeries(data.map((item) => item.count));
  }, [data]);

  return (
    <div className="rounded-lg">
      <ReactApexChart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
}
