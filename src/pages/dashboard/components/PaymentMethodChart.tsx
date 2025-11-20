import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import type { PaymentMethodData } from '../../utils/traffic-aggregation';

interface PaymentMethodChartProps {
  data: PaymentMethodData[];
}

export default function PaymentMethodChart({
  data,
}: PaymentMethodChartProps) {
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
    colors: ['#3C50E0'],
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
        categories: data.map((item) => item.method),
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
