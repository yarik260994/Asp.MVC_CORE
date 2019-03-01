import {computedFrom} from 'aurelia-framework';
import { DateTimeVariant } from '../../../../custom_typings/Buttons/DateTimeVariant';
import { CommonTableProperties } from '../../../../custom_typings/Buttons/CommonTableProperties';

export class CommonTableImplementation implements CommonTableProperties {
    ColumnsCount: number = 1;
    DateTimeColumn: DateTimeVariant = null;
	PrintFileColumn: boolean = false;
	
	constructor(src: CommonTableProperties) {
		if (src) {
			if (src.DateTimeColumn != DateTimeVariant.DateTime && src.DateTimeColumn != DateTimeVariant.Time)
				src.DateTimeColumn = null;
			this.ColumnsCount = src.ColumnsCount;
			this.DateTimeColumn = src.DateTimeColumn;
			this.PrintFileColumn = src.PrintFileColumn;
		}
	}

	@computedFrom('DateTimeColumn')
	get DateTimeColumnExists(): boolean {
		return this.DateTimeColumn != null;
	}
	set DateTimeColumnExists(val: boolean) {
		this.DateTimeColumn = val ? DateTimeVariant.Time : null;
	}

	@computedFrom('ColumnsCount')
	get ColumnsCountString(): string {
		return this.ColumnsCount.toString();
	}
	set ColumnsCountString(val: string) {
		let valNumber = parseInt(val);
		if (!valNumber || valNumber == NaN || valNumber < 0) {
			//this.ColumnsCount = 1;
			this.ColumnsCount = 0;
		} else {
			this.ColumnsCount = valNumber;
		}
	}
}