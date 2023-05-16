import { NextResponse } from 'next/server'
import { products } from '../products'
import { packs } from '../packs'
import { z } from 'zod'

interface CsvData {
	product_code: number
	new_price: number
}

interface ParsedData {
	data: {
		product_code: number
		new_price: number
	}
	broken_rules: string[]
}

interface ValidatedData {
	data: {
		product_code: number
		product_name?: string
		current_price: number
		new_price: number
	}
	broken_rules: string[]
}

function parsePresenceAndType(raw_data: CsvData[]) {
	const row_schema = z.object({
		product_code: z.coerce.number().positive(),
		new_price: z.coerce.number().positive()
	})

	return raw_data.map((row) => {
		const info = row_schema.safeParse(row)

		if (info.success) return { data: info.data, broken_rules: [] }

		const broken_rules = []

		const data = { product_code: 0, new_price: 0 }

		if (!row.new_price) {
			broken_rules.push('missing new price')
		} else {
			try {
				data.new_price = z.coerce.number().parse(row.new_price)
			} catch (error) {
				broken_rules.push('invalid new price')
			}
		}

		if (!row.product_code) {
			broken_rules.push('missing product code')
		} else {
			try {
				data.product_code = z.coerce.number().parse(row.product_code)
			} catch (error) {
				broken_rules.push('invalid product code')
			}
		}

		return { data, broken_rules }
	})
}

function validateData(parsed_data: ParsedData[]): ValidatedData[] {
	return parsed_data.map((row) => {
		const product_code = row.data.product_code

		const new_price = row.data.new_price

		const broken_rules = [...row.broken_rules]

		const product = products.find((product) => product.code === product_code)

		if (!product) {
			broken_rules.push('product code does not exist')
			return {
				data: {
					product_code,
					new_price,
					product_name: undefined,
					current_price: 0
				},
				broken_rules
			}
		}

		if (new_price < product.cost_price)
			broken_rules.push('new price must be higher than cost price')

		const change = Math.abs(product.sales_price - new_price)
		if (change > product.sales_price * 0.1)
			broken_rules.push('price adjustment must not be bigger than 10%')

		return {
			data: {
				product_code,
				new_price,
				product_name: product?.name,
				current_price: product?.sales_price || 0
			},
			broken_rules
		}
	})
}

export async function POST(request: Request) {
	const { csv_data }: { csv_data: CsvData[] } = (await request.json()) as {
		csv_data: CsvData[]
	}

	// console.log('raw: ', csv_data)

	const parsed_csv_data = parsePresenceAndType(csv_data)

	// console.log('parsed: ', parsed_csv_data)

	const validated_data = validateData(parsed_csv_data)

	// console.log('validated: ', validated_data)

	return NextResponse.json(validated_data)
}
