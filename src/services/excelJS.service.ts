import * as Excel from 'exceljs';
import { checkStringExist, readFileToBuffer, saveExcelBufferToFile } from '../utils';
import { IAccount, IAccountVerify, IExportAccountResource } from '../interfaces';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { Blob } from 'buffer';
import logger from '../logger';

export class ExcelJSService {
  workbook: Excel.Workbook;

  constructor() {
    this.workbook = new Excel.Workbook();
  }
  /**
   * Autofit columns by width
   *
   * @param worksheet {ExcelJS.Worksheet}
   * @param minimalWidth
   */
  private autoWidth = (worksheet: Excel.Worksheet, minimalWidth = 10) => {
    worksheet.columns.forEach((column) => {
      let maxColumnLength = 0;
      //@ts-ignore
      column.eachCell({ includeEmpty: true }, (cell) => {
        maxColumnLength = Math.max(maxColumnLength, minimalWidth, cell.value ? cell.value.toString().length : 0);
      });
      column.width = maxColumnLength + 2;
    });
  };

  private mapDataToAccountVerifyResource(data: IAccountVerify[]): IExportAccountResource[] {
    return data.map((item) => {
      return {
        portable: item.portable,
        twitter: checkStringExist(item.twitterError) ? '⛔️' : '✅',
        discord: checkStringExist(item.discordError) ? '⛔' : '✅',
        gmail: checkStringExist(item.gmailError) ? '⛔' : '✅',
        wallet: checkStringExist(item.walletError) ? '⛔' : '✅',
        discordAccount: item.discordAccount,
        twitterAccount: item.twitterAccount,
        gmailAccount: item.gmailAccount,
        walletAddress: item.walletAddress,
        twitterError: item.twitterError,
        discordError: item.discordError,
        gmailError: item.gmailError,
        walletError: item.walletError,
      };
    });
  }

  async exportFileAccountVerify(data: IAccountVerify[], sheet: string, pathExport: string) {
    const worksheet = this.workbook.addWorksheet(sheet, {});
    const dataExport: IExportAccountResource[] = this.mapDataToAccountVerifyResource(data);

    worksheet.columns = [
      { header: 'portable', key: 'portable' },
      { header: 'Twitter Checked', key: 'twitter' },
      { header: 'Discord Checked', key: 'discord' },
      { header: 'Gmail Checked', key: 'gmail' },
      { header: 'Wallet Checked', key: 'wallet' },
      { header: 'Twitter Error', key: 'twitterError' },
      { header: 'Discord Error', key: 'discordError' },
      { header: 'Gmail Error', key: 'gmailError' },
      { header: 'Wallet Error', key: 'walletError' },
      { header: 'Twitter Account', key: 'twitterAccount' },
      { header: 'Discord Account', key: 'discordAccount' },
      { header: 'Gmail Account', key: 'gmailAccount' },
      { header: 'Metamask Wallet Address', key: 'walletAddress' },
    ];

    this.autoWidth(worksheet);

    worksheet.eachRow(function (row, rowNumber) {
      worksheet.addRow(dataExport[rowNumber - 1]);
    });

    const filePathExport = `${pathExport}/output-${moment().format('hhmmssDDMMYYY')}.xlsx`;

    const buffer = await this.workbook.xlsx.writeBuffer();
    await saveExcelBufferToFile(buffer, filePathExport);
  }

  mapDataToAccountResource(data: string[][]): IAccount[] {
    const result: IAccount[] = [];
    for (const item of data) {
      const [nullValue, id, email, passEmail, twitter, passTwitter, discordToken] = item;
      result.push({
        portable: Number(id),
        email,
        passEmail,
        twitter,
        passTwitter,
        discordToken,
      });
    }

    return result;
  }

  async readDataFromExcelSheet(path: string, sheet: string): Promise<string[][]> {
    const buffer = await readFileToBuffer(path);
    await this.workbook.xlsx.load(buffer);
    const worksheet = this.workbook.getWorksheet(sheet);

    const data: string[][] = [];

    worksheet.eachRow(function (row, rowNumber) {
      if (rowNumber <= 1) {
        return;
      }

      data.push(row.values as string[]);
    });

    return data;
  }
}
