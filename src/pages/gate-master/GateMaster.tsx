import { useState, useEffect } from 'react';
import PageMeta from '../../components/common/PageMeta';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import ComponentCard from '../../components/common/ComponentCard';
import Pagination from '../../components/common/Pagination';
import { gateMasterApi } from '../../api';
import type { GateMaster } from '../../api/gate-master/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import Button from '../../components/ui/button/Button';
import GateMasterFormModal from './components/GateMasterFormModal';
import GateMasterDeleteModal from './components/GateMasterDeleteModal';

export default function GateMaster() {
  const [gateMasters, setGateMasters] = useState<GateMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGateMaster, setSelectedGateMaster] =
    useState<GateMaster | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    IdCabang: '',
    NamaCabang: '',
    NamaGerbang: '',
  });

  const fetchData = async (page: number = currentPage) => {
    try {
      setIsLoading(true);
      setError('');
      const response = await gateMasterApi.fetchAll(page, itemsPerPage);
      setGateMasters(response.data.rows.rows);
      setTotalPages(response.data.total_pages);
      setTotalItems(response.data.count);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    fetchData(page);
  };

  const handleLimitChange = (newLimit: number) => {
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to page 1 when limit changes
  };

  const handleOpenCreateModal = () => {
    setSelectedGateMaster(null);

    const newId =
      gateMasters.length > 0 ? Math.max(...gateMasters.map(g => g.id)) + 1 : 1;
    setFormData({
      id: newId.toString(),
      IdCabang: '',
      NamaCabang: '',
      NamaGerbang: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenUpdateModal = (gateMaster: GateMaster) => {
    setSelectedGateMaster(gateMaster);
    setFormData({
      id: gateMaster.id.toString(),
      IdCabang: gateMaster.IdCabang.toString(),
      NamaCabang: gateMaster.NamaCabang,
      NamaGerbang: gateMaster.NamaGerbang,
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (gateMaster: GateMaster) => {
    setSelectedGateMaster(gateMaster);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedGateMaster(null);
    setFormData({
      id: '',
      IdCabang: '',
      NamaCabang: '',
      NamaGerbang: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const id = parseInt(formData.id);
      const IdCabang = parseInt(formData.IdCabang);

      const payload = {
        id,
        IdCabang,
        NamaCabang: formData.NamaCabang,
        NamaGerbang: formData.NamaGerbang,
      };

      if (selectedGateMaster) {
        await gateMasterApi.update(payload);
      } else {
        await gateMasterApi.create(payload);
      }

      await fetchData();
      handleCloseModal();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedGateMaster) return;

    setIsSubmitting(true);
    setError('');

    try {
      await gateMasterApi.delete(
        selectedGateMaster.id,
        selectedGateMaster.IdCabang
      );
      await fetchData();
      handleCloseModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete data');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Gate Master | TailAdmin - React.js Admin Dashboard Template"
        description="This is Gate Master page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Gate Master" />

      <div className="space-y-6">
        <ComponentCard
          title="Gate Master Data"
          headerAction={
            <Button
              size="sm"
              variant="success"
              onClick={handleOpenCreateModal}
              startIcon={
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              Create
            </Button>
          }
        >
          {error && (
            <div className="bg-error-50 dark:bg-error-900/20 text-error-600 dark:text-error-400 mb-6 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
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
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/5">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-[800px]">
                    <Table>
                    {/* Table Header */}
                    <TableHeader className="border-b border-gray-100 bg-gray-50 dark:border-white/5 dark:bg-transparent">
                      <TableRow className="bg-gray-50 dark:bg-transparent">
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          No
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          ID
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          ID Cabang
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          Nama Cabang
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          Nama Gerbang
                        </TableCell>
                        <TableCell
                          isHeader
                          className="text-theme-xs px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
                      {gateMasters.length === 0 ? (
                        <TableRow className="bg-white dark:bg-transparent">
                          <TableCell
                            colSpan={6}
                            className="px-5 py-8 text-center text-sm text-gray-500 dark:text-gray-400"
                          >
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        gateMasters.map((gateMaster, index) => (
                          <TableRow
                            key={`${gateMaster.IdCabang}-${gateMaster.id}`}
                            className="bg-white dark:bg-transparent"
                          >
                            <TableCell className="text-theme-sm px-5 py-4 text-start text-gray-800 dark:text-white/90">
                              {(currentPage - 1) * itemsPerPage + index + 1}
                            </TableCell>
                            <TableCell className="text-theme-sm px-5 py-4 text-start text-gray-800 dark:text-white/90">
                              {gateMaster.id}
                            </TableCell>
                            <TableCell className="text-theme-sm px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                              {gateMaster.IdCabang}
                            </TableCell>
                            <TableCell className="text-theme-sm px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                              {gateMaster.NamaCabang}
                            </TableCell>
                            <TableCell className="text-theme-sm px-5 py-4 text-start text-gray-500 dark:text-gray-400">
                              {gateMaster.NamaGerbang}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-start">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() =>
                                    handleOpenUpdateModal(gateMaster)
                                  }
                                  startIcon={
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                      />
                                    </svg>
                                  }
                                >
                                  Update
                                </Button>
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onClick={() =>
                                    handleOpenDeleteModal(gateMaster)
                                  }
                                  startIcon={
                                    <svg
                                      className="h-4 w-4"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  }
                                >
                                  Delete
                                </Button>
                              </div>
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
              {!isLoading && gateMasters.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onLimitChange={handleLimitChange}
                  limitOptions={[5, 10, 20]}
                />
              )}
            </>
          )}
        </ComponentCard>
      </div>

      <GateMasterFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        selectedGateMaster={selectedGateMaster}
        formData={formData}
        onInputChange={handleInputChange}
        isSubmitting={isSubmitting}
      />

      <GateMasterDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        selectedGateMaster={selectedGateMaster}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
