'use client';

import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

interface ExportButtonProps {
  data: any[];
}

export default function ExportButton({ data }: ExportButtonProps) {
  const handleExport = () => {
    // Формируем данные для таблицы
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((order) => ({
        Дата: new Date(order.createdAt).toLocaleString('ru-RU'),
        'ID Заказа': order.id,
        'Сумма (₽)': order.amount,
        Статус: order.status === 'paid' ? 'Оплачено' : 'Ожидание',
        Пользователь: order.userId,
      })),
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Заказы');

    // Генерируем и скачиваем файл
    XLSX.writeFile(
      workbook,
      `Отчет_MSS_${new Date().toLocaleDateString()}.xlsx`,
    );
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
    >
      <Download size={14} />
      Выгрузить в Excel
    </button>
  );
}