import { Pipe, PipeTransform } from '@angular/core';

/**
 * Sorts an array by one of its items' properties.
 * Values are compared as numbers when both are numeric, otherwise as case-insensitive text.
 */
@Pipe({ name: 'orderby' })
export class OrderByPipe implements PipeTransform {
  /**
   * @param array Items to sort; the input array is not mutated.
   * @param orderBy Property to sort by; an empty key returns the input unchanged.
   * @param asc Sort ascending when true (default), descending otherwise.
   * @returns A sorted copy of `array`, or `array` itself when `orderBy` is empty.
   */
  transform<T>(array: T[], orderBy: keyof T | '', asc = true): T[] {
    if (!orderBy || String(orderBy).trim() === '') {
      return array;
    }
    const key = orderBy;
    //ascending
    if (asc) {
      return Array.from(array).sort((item1, item2) => {
        return this.orderByComparator(item1[key], item2[key]);
      });
    }
    else {
      //not asc
      return Array.from(array).sort((item1, item2) => {
        return this.orderByComparator(item2[key], item1[key]);
      });
    }

  }

  /**
   * Compares two property values for sorting.
   * @returns A negative number, zero or a positive number, as `Array.prototype.sort` expects.
   */
  orderByComparator(a: unknown, b: unknown): number {

    if (!this.isNumeric(a) || !this.isNumeric(b)) {
      //Isn't a number so lowercase the string to properly compare
      const textA = String(a).toLowerCase();
      const textB = String(b).toLowerCase();
      if (textA < textB) return -1;
      if (textA > textB) return 1;
    }
    else {
      //Parse strings as numbers to compare properly
      const numA = parseFloat(String(a));
      const numB = parseFloat(String(b));
      if (numA < numB) return -1;
      if (numA > numB) return 1;
    }

    return 0; //equal each other
  }

  private isNumeric(value: unknown): boolean {
    return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
  }
}
