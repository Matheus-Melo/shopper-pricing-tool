import { useProductData } from '@/contexts/DataContext'
import Product from './Product'
import './productList.css'

export default function ProductList() {
	const { productData } = useProductData()

	return (
		<div className="flex flex-col h-full overflow-auto py-8 px-6 bg-violet-600">
			<table className="table">
				<thead>
					<tr>
						<th>Code</th>
						<th>Product</th>
						<th>Current Price</th>
						<th>New Price</th>
						<th>Rules Broken</th>
					</tr>
				</thead>
				<tbody>
					{productData.map((item, index) => {
						return (
							<Product
								data={item.data}
								broken_rules={item.broken_rules}
								key={item.data.product_code || index}
							/>
						)
					})}
				</tbody>
			</table>
		</div>
	)
}
