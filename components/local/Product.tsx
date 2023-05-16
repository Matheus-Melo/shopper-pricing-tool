import { ProductData } from '@/contexts/DataContext'

export default function Product({ data, broken_rules }: ProductData) {
	return (
		<tr>
			<td>{data.product_code}</td>
			<td>{data.product_name}</td>
			<td>{data.current_price}</td>
			<td>{data.new_price}</td>
			<td className={broken_rules.length ? 'bg-red-700' : ''}>
				{broken_rules.map((rule) => {
					return <p key={`${data.product_code}-${rule}`}>{rule}</p>
				})}
			</td>
		</tr>
	)
}
