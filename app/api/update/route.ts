import { NextResponse } from 'next/server'
import { products } from '../products'
import { packs } from '../packs'

interface ValidatedData {
	data: {
		product_code: number
		product_name?: string
		current_price: number
		new_price: number
	}
	broken_rules: string[]
}

export async function POST(request: Request) {
	const { data } = (await request.json()) as { data: ValidatedData[] }

	data.forEach((element) => {
		const index = products.findIndex(
			(item) => item.code === element.data.product_code
		)
		if (index !== -1) {
			products[index] = {
				...products[index],
				sales_price: element.data.new_price
			}
		}
	})

	const result = data.map((element) => {
		return {
			data: {
				...element.data,
				current_price: products.find(
					(item) => item.code === element.data.product_code
				)?.sales_price
			},
			broken_rules: element.broken_rules
		}
	})

	return NextResponse.json(result)
}
