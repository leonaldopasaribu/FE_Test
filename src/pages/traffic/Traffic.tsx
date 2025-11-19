import { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Pagination from '../../components/common/Pagination';
import SearchInput from '../../components/common/SearchInput';
import { trafficApi } from '../../api';
import type { Traffic, GroupedTrafficRow } from '../../api/traffic/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import Alert from '../../components/ui/alert/Alert';
import Button from '../../components/ui/button/Button';
import Input from '../../components/form/input/InputField';

export default function TrafficPage() {
  const [traffics, setTraffics] = useState<Traffic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'all' | 'tunai' | 'etoll' | 'flo' | 'ktp'
  >('all');

  const fetchData = async (
    page: number = currentPage,
    date: string = dateFilter
  ) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await trafficApi.fetchAll(
        page,
        itemsPerPage,
        date || undefined
      );
      setTraffics(response.data.rows.rows);
      setTotalPages(response.data.total_pages);
      setTotalItems(response.data.count);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateFilter(value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleApplyFilter = () => {
    setCurrentPage(1);
    fetchData(1, dateFilter);
  };

  const handleClearFilter = () => {
    setDateFilter('');
    setSearchQuery('');
    setCurrentPage(1);
    fetchData(1, '');
  };

  useEffect(() => {
    fetchData(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1);
  };

  // Transform data: group by Gardu, Tanggal, Shift, and payment method
  const groupedData: GroupedTrafficRow[] = [];

  if (traffics.length > 0) {
    const groupKey = (t: Traffic) =>
      `${t.IdGardu}-${t.Tanggal}-${t.Shift}-${t.IdAsalGerbang}`;

    const groups = new Map<string, Traffic[]>();
    traffics.forEach(traffic => {
      const key = groupKey(traffic);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(traffic);
    });

    groups.forEach(group => {
      const first = group[0];

      // Calculate totals for each payment method
      const tunaiRow: GroupedTrafficRow = {
        IdCabang: first.IdCabang,
        IdGerbang: first.IdGerbang,
        IdGardu: first.IdGardu,
        Tanggal: first.Tanggal,
        Shift: first.Shift,
        IdAsalGerbang: first.IdAsalGerbang,
        metodePembayaran: 'Tunai',
        gol1: 0,
        gol2: 0,
        gol3: 0,
        gol4: 0,
        gol5: 0,
        totalLalin: 0,
      };

      group.forEach(t => {
        const gol = `gol${t.Golongan}` as keyof Pick<
          GroupedTrafficRow,
          'gol1' | 'gol2' | 'gol3' | 'gol4' | 'gol5'
        >;
        tunaiRow[gol] += t.Tunai;
      });
      tunaiRow.totalLalin =
        tunaiRow.gol1 +
        tunaiRow.gol2 +
        tunaiRow.gol3 +
        tunaiRow.gol4 +
        tunaiRow.gol5;

      if (tunaiRow.totalLalin > 0) groupedData.push(tunaiRow);

      // E-Toll (sum of all e-payments)
      const etollRow: GroupedTrafficRow = {
        ...tunaiRow,
        metodePembayaran: 'E-Toll',
        gol1: 0,
        gol2: 0,
        gol3: 0,
        gol4: 0,
        gol5: 0,
        totalLalin: 0,
      };

      group.forEach(t => {
        const gol = `gol${t.Golongan}` as keyof Pick<
          GroupedTrafficRow,
          'gol1' | 'gol2' | 'gol3' | 'gol4' | 'gol5'
        >;
        const etollTotal =
          t.eMandiri + t.eBri + t.eBni + t.eBca + t.eNobu + t.eDKI + t.eMega;
        etollRow[gol] += etollTotal;
      });
      etollRow.totalLalin =
        etollRow.gol1 +
        etollRow.gol2 +
        etollRow.gol3 +
        etollRow.gol4 +
        etollRow.gol5;

      if (etollRow.totalLalin > 0) groupedData.push(etollRow);

      // Flo
      const floRow: GroupedTrafficRow = {
        ...tunaiRow,
        metodePembayaran: 'Flo',
        gol1: 0,
        gol2: 0,
        gol3: 0,
        gol4: 0,
        gol5: 0,
        totalLalin: 0,
      };

      group.forEach(t => {
        const gol = `gol${t.Golongan}` as keyof Pick<
          GroupedTrafficRow,
          'gol1' | 'gol2' | 'gol3' | 'gol4' | 'gol5'
        >;
        floRow[gol] += t.eFlo;
      });
      floRow.totalLalin =
        floRow.gol1 + floRow.gol2 + floRow.gol3 + floRow.gol4 + floRow.gol5;

      if (floRow.totalLalin > 0) groupedData.push(floRow);
    });
  }

  // Calculate summary statistics
  const totalTunai = groupedData
    .filter(row => row.metodePembayaran === 'Tunai')
    .reduce((sum, row) => sum + row.totalLalin, 0);

  const totalEToll = groupedData
    .filter(row => row.metodePembayaran === 'E-Toll')
    .reduce((sum, row) => sum + row.totalLalin, 0);

  const totalFlo = groupedData
    .filter(row => row.metodePembayaran === 'Flo')
    .reduce((sum, row) => sum + row.totalLalin, 0);

  const getDayName = (dateString: string) => {
    const days = [
      'Minggu',
      'Senin',
      'Selasa',
      'Rabu',
      'Kamis',
      'Jumat',
      'Sabtu',
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      <PageMeta
        title="Traffic Per Day | Jasa Marga"
        description="Traffic Per Day Report"
      />
      <PageBreadcrumb pageTitle="Traffic Per Day" />

      <div className="space-y-6">
        <ComponentCard title="Traffic Per Day">
          {error && (
            <Alert variant="error" title="Error" message={error}></Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="border-t-brand-500 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">
                Loading...
              </span>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="mb-6 flex flex-wrap items-end gap-3">
                <div className="min-w-[200px] flex-1">
                  <SearchInput
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search"
                  />
                </div>
                <div className="min-w-[200px] flex-1">
                  <Input
                    type="date"
                    value={dateFilter}
                    onChange={handleDateFilterChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-800"
                    placeholder="Tanggal"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleApplyFilter}
                    variant="success"
                  >
                    Filter
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleClearFilter}
                    variant="primary"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-center text-gray-600">
                  <div className="text-xs font-medium text-gray-600 opacity-90">
                    Total Tunai
                  </div>
                  <div className="text-lg font-bold">
                    {totalTunai.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-center dark:bg-gray-700">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Total E-Toll
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {totalEToll.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-center dark:bg-gray-700">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Total Flo
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {totalFlo.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-center dark:bg-gray-700">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Total KTP
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    0
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-center dark:bg-gray-700">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Total Keseluruhan
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {(totalTunai + totalEToll + totalFlo).toLocaleString()}
                  </div>
                </div>
                <div className="rounded-lg bg-gray-100 px-4 py-3 text-center dark:bg-gray-700">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Total E-Toll+Tunai+Flo
                  </div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {(totalTunai + totalEToll + totalFlo).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex gap-2" aria-label="Tabs">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`${
                        activeTab === 'all'
                          ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      } border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap`}
                    >
                      Semua
                    </button>
                    <button
                      onClick={() => setActiveTab('tunai')}
                      className={`${
                        activeTab === 'tunai'
                          ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      } border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap`}
                    >
                      Tunai ({totalTunai.toLocaleString()})
                    </button>
                    <button
                      onClick={() => setActiveTab('etoll')}
                      className={`${
                        activeTab === 'etoll'
                          ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      } border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap`}
                    >
                      E-Toll ({totalEToll.toLocaleString()})
                    </button>
                    <button
                      onClick={() => setActiveTab('flo')}
                      className={`${
                        activeTab === 'flo'
                          ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      } border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap`}
                    >
                      Flo ({totalFlo.toLocaleString()})
                    </button>
                    <button
                      onClick={() => setActiveTab('ktp')}
                      className={`${
                        activeTab === 'ktp'
                          ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      } border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap`}
                    >
                      KTP (0)
                    </button>
                  </nav>
                </div>
              </div>

              {/* Export Button */}
              <div className="mb-4 flex justify-end">
                <Button>
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Export
                </Button>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/5">
                <div className="max-w-full overflow-x-auto">
                  <div>
                    <Table>
                      {/* Table Header */}
                      <TableHeader className="border-b border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-transparent">
                        <TableRow className="bg-gray-50 dark:bg-transparent">
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            No.
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Ruas
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Gerbang
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Gardu
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Hari
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Tanggal
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Metode Pembayaran
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Gol I
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Gol II
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Gol III
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Gol IV
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Gol V
                          </TableCell>
                          <TableCell
                            isHeader
                            className="text-theme-xs px-4 py-3 text-center font-medium text-gray-500 dark:text-gray-400"
                          >
                            Total Lalin
                          </TableCell>
                        </TableRow>
                      </TableHeader>

                      <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                        {groupedData.length === 0 ? (
                          <TableRow className="bg-white dark:bg-transparent">
                            <TableCell
                              colSpan={13}
                              className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        ) : (
                          groupedData
                            .filter(row => {
                              if (activeTab === 'all') return true;
                              if (activeTab === 'tunai')
                                return row.metodePembayaran === 'Tunai';
                              if (activeTab === 'etoll')
                                return row.metodePembayaran === 'E-Toll';
                              if (activeTab === 'flo')
                                return row.metodePembayaran === 'Flo';
                              if (activeTab === 'ktp') return false; // No KTP data yet
                              return true;
                            })
                            .map((row, index) => (
                              <TableRow
                                key={`${row.IdGardu}-${row.Tanggal}-${row.Shift}-${row.metodePembayaran}-${index}`}
                                className="bg-white hover:bg-gray-50 dark:bg-transparent dark:hover:bg-gray-800/50"
                              >
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-800 dark:text-white/90">
                                  {index + 1}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  Ruas {row.IdCabang}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  Gerbang {row.IdGerbang}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {String(row.IdGardu).padStart(2, '0')}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {getDayName(row.Tanggal)}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {formatDate(row.Tanggal)}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {row.metodePembayaran}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {row.gol1.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {row.gol2.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {row.gol3.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {row.gol4.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                                  {row.gol5.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-theme-sm px-4 py-3 text-center font-semibold text-gray-800 dark:text-white/90">
                                  {row.totalLalin.toLocaleString()}
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Pagination */}
              {!isLoading && groupedData.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onLimitChange={handleLimitChange}
                  limitOptions={[5, 10, 20, 50]}
                />
              )}
            </>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
