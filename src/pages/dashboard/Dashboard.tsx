import { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import { trafficApi } from '../../api/traffic/traffic.api';
import type { Traffic } from '../../api/traffic/types';
import {
  TrafficAggregationUtil,
  type PaymentMethodData,
  type GateData,
  type ShiftData,
  type BranchData,
} from '../../utils/traffic-aggregation';
import PaymentMethodChart from './components/PaymentMethodChart';
import GateChart from './components/GateChart';
import ShiftChart from './components/ShiftChart';
import BranchChart from './components/BranchChart';
import DatePicker from '../../components/form/input/DatePicker';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [trafficData, setTrafficData] = useState<Traffic[]>([]);

  const [paymentMethodData, setPaymentMethodData] = useState<
    PaymentMethodData[]
  >([]);
  const [gateData, setGateData] = useState<GateData[]>([]);
  const [shiftData, setShiftData] = useState<ShiftData[]>([]);
  const [branchData, setBranchData] = useState<BranchData[]>([]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await trafficApi.fetchAll(1, 1000, selectedDate);
      const allTraffic = response.data.rows.rows;
      setTrafficData(allTraffic);

      setPaymentMethodData(
        TrafficAggregationUtil.aggregatePaymentMethods(allTraffic)
      );
      setGateData(TrafficAggregationUtil.aggregateByGate(allTraffic));
      setShiftData(TrafficAggregationUtil.aggregateByShift(allTraffic));
      setBranchData(TrafficAggregationUtil.aggregateByBranch(allTraffic));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedDate]);

  const handleSearch = () => {
    fetchDashboardData();
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <>
      <PageMeta
        title="Dashboard | Jasa Marga"
        description="This is Dashboard page for Jasa Marga"
      />

      <PageBreadcrumb pageTitle="Dashboard" />

      <ComponentCard title="Dashboard">
        <div className="mx-auto max-w-screen-2xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="w-full sm:w-64">
                <DatePicker
                  value={selectedDate}
                  onChange={handleDateChange}
                  placeholder="Select date"
                />
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <div className="border-primary h-16 w-16 animate-spin rounded-full border-4 border-solid border-t-transparent"></div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ComponentCard title="Jumlah Lalin per Metode Pembayaran">
                  <PaymentMethodChart data={paymentMethodData} />
                </ComponentCard>
                <ComponentCard title="Jumlah Lalin per Gerbang">
                  <GateChart data={gateData} />
                </ComponentCard>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ComponentCard title="Presentase Lalin per Shift">
                  <ShiftChart data={shiftData} />
                </ComponentCard>
                <ComponentCard title="Presentase Lalin per Ruas (Cabang)">
                  <BranchChart data={branchData} />
                </ComponentCard>
              </div>
            </div>
          )}
        </div>
      </ComponentCard>
    </>
  );
}
