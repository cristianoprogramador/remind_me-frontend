"use client";

import { UserProps } from "@/types";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GrDocumentExcel } from "react-icons/gr";
import * as XLSX from "xlsx";

interface ErrorLog {
  uuid: string;
  statusCode: number;
  error: string;
  message: string;
  url: string;
  method: string;
  createdAt: string;
}

export default function ErrorLogs() {
  const [loading, setLoading] = useState(false);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const { data: session } = useSession();

  const [actualPage, setActualPage] = useState<number>(1);
  const [totalPerPage, setTotalPerPage] = useState<number>(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [totalLogs, setTotalLogs] = useState<number>(0);

  const { t } = useTranslation();

  async function fetchErrorLogs() {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/errorLogs/list?page=${actualPage}&itemsPerPage=${totalPerPage}` +
          (searchQuery ? `&search=${searchQuery}` : ""),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session?.user as UserProps)?.token}`,
          },
        }
      );
      const data = await res.json();

      setErrorLogs(data.errorLogs);
      setTotalLogs(data.total);
    } catch (error) {
      console.error("Falha ao buscar logs de erro:", error);
    } finally {
      setLoading(false);
    }
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(errorLogs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Error Logs");
    XLSX.writeFile(workbook, "error_logs.xlsx");
  };

  const totalPages = Math.ceil(totalLogs / totalPerPage);

  const handleSearch = () => {
    setActualPage(1);
    setSearchQuery(searchTerm);
  };

  useEffect(() => {
    fetchErrorLogs();
  }, [actualPage, totalPerPage, searchQuery]);

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="w-[90%] bg-gray-200 flex flex-col justify-center items-center border rounded-lg h-[80%]">
        {!loading ? (
          <div className="px-4 h-full w-full flex flex-col">
            <div className="text-center py-5 font-semibold text-xl text-gray-800">
              {t("errorLogs.title")}
            </div>
            <div className="mb-4 flex items-center justify-between w-full">
              <div className="flex flex-row gap-2 min-w-96">
                <input
                  type="text"
                  placeholder={t("errorLogs.searchPlaceholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-300 rounded-md px-4 py-2 w-full min-w-md"
                />
                <button
                  onClick={handleSearch}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
                >
                  {t("errorLogs.searchButton")}
                </button>
              </div>
              <div className="mr-5 flex flex-row gap-2">
                <GrDocumentExcel
                  size={30}
                  color="darkblue"
                  className="cursor-pointer hover:opacity-60"
                  onClick={exportToExcel}
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 w-full border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr className="text-xs text-center font-medium text-gray-500 uppercase">
                    <th className="lg:px-6 lg:py-3">
                      {t("errorLogs.statusCode")}
                    </th>
                    <th className="lg:px-6 lg:py-3">{t("errorLogs.error")}</th>
                    <th className="lg:px-6 lg:py-3">
                      {t("errorLogs.message")}
                    </th>
                    <th className="lg:px-6 lg:py-3">{t("errorLogs.url")}</th>
                    <th className="lg:px-6 lg:py-3">{t("errorLogs.method")}</th>
                    <th className="lg:px-6 lg:py-3">
                      {t("errorLogs.createdAt")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {errorLogs.map((log) => (
                    <tr key={log.uuid} className="text-xs text-center">
                      <td>{log.statusCode}</td>
                      <td>{log.error}</td>
                      <td>
                        {log.message.length > 50
                          ? `${log.message.slice(0, 50)}...`
                          : log.message}
                      </td>
                      <td>
                        {log.url.length > 50
                          ? `${log.url.slice(0, 50)}...`
                          : log.url}
                      </td>
                      <td>{log.method}</td>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                {t("errorLogs.total")}: {totalLogs}
              </div>
              <div className="flex items-center">
                <span className="mr-2">{t("errorLogs.itemsPerPage")}:</span>
                <select
                  className="border border-gray-300 rounded-md"
                  value={totalPerPage}
                  onChange={(e) => setTotalPerPage(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  onClick={() => setActualPage((prev) => Math.max(prev - 1, 1))}
                  disabled={actualPage === 1}
                >
                  {t("errorLogs.previous")}
                </button>
                <span>
                  {actualPage} / {totalPages}
                </span>
                <button
                  className="px-2 py-1 border border-gray-300 rounded-md"
                  onClick={() =>
                    setActualPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={actualPage === totalPages}
                >
                  {t("errorLogs.next")}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p>{t("errorLogs.loading")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
