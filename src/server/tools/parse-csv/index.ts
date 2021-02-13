import ExcelJS from 'exceljs';
import { rmdirSync, writeFileSync, mkdtempSync } from 'fs';
import * as path from 'path';

/**
 *
 * @param content
 */
export default async (content: string) => {
  const wb = new ExcelJS.Workbook();
  const tmpdir = mkdtempSync(`csv_${Date.now()}`);
  const tmpfile = path.join(tmpdir, 'tmp.csv');
  writeFileSync(tmpfile, content, { encoding: 'utf-8' });
  const sheet = await wb.csv.readFile(tmpfile, {
    map: (value: any) => ([undefined, null].includes(value) ? '' : `${value}`.replace(/^[']([+-=])/, '$1')),
  });

  const rowValues = await sheet.getSheetValues();
  rmdirSync(tmpdir, { recursive: true, });
  return rowValues.slice(1).map((columns) => (Array.isArray(columns) ? columns.slice(1) : []));
};
